import sequelize, {
  Client,
  CrenditionalTypes,
  ScopeTypes,
  User,
  UserCrenditional,
  UserCrenditionalRealtion,
} from "../model";
import fs from "fs";
import path from "path";
import { config } from "../configures";

export async function dbSync(isSync = false) {
  if (!isSync) {
    console.log("Skip Sync");

    return;
  }

  await sequelize.sync();

  const triggers = fs.readFileSync(
    path.join(process.cwd(), "query.sql"),
    "utf-8",
  );

  const transaction = await sequelize.transaction();

  try {
    sequelize.query(triggers, {
      transaction,
    });

    await Promise.all(
      config.user?.operator?.map(async (nUser) => {
        const operator = await UserCrenditional.findOne({
          where: {
            username: nUser.username,
          },
          benchmark: process.env.NODE_ENV !== "production",
          transaction,
        });

        if (operator) {
          console.info(`Already exist ${nUser.username}`);
          return;
        }

        const crenditional = await UserCrenditional.create(
          {
            password: nUser.password,
            username: nUser.username,
            type: CrenditionalTypes.password,
          },
          {
            transaction,
            benchmark: process.env.NODE_ENV !== "production",
          },
        );

        const user = await User.create(
          {
            email: nUser.email,
            name: nUser.name,
            phone: nUser.phone,
            scope: ScopeTypes.operator,
          },
          {
            transaction,
            benchmark: process.env.NODE_ENV !== "production",
          },
        );

        const crenditionalRelation = await UserCrenditionalRealtion.create(
          {
            userId: user.id,
            crenditionalId: crenditional.id,
          },
          {
            transaction,
            benchmark: process.env.NODE_ENV !== "production",
          },
        );
      }) || [],
    );

    await Promise.all(
      config.client?.map(async (nClient) => {
        const checkClient = await Client.findOne({
          where: {
            clientId: nClient.clientId,
          },
          benchmark: process.env.NODE_ENV !== "production",
          transaction,
        });

        if (checkClient) {
          return;
        }

        await Client.create(
          {
            name: nClient.name,
            clientId: nClient.clientId,
            clientSecret: nClient.clientSecret,
            scope: nClient.scope,
            grants: nClient.grants,
            redirectUris: nClient.redirectUris,
            accessTokenLifetime: nClient.accessTokenLifetime || 3600,
            refreshTokenLifetime: nClient.refreshTokenLifetime || 7200,
          },
          {
            benchmark: process.env.NODE_ENV !== "production",
            transaction,
          },
        );
      }) || [],
    );

    await transaction.commit();
  } catch (e) {
    console.error(e);
    await transaction.rollback();
  }
}
