import { Model, ModelCtor, SequelizeOptions } from "sequelize-typescript";
import configure from "./sequelize.json";
import fs from "fs";
import path from "path";
import sequelize, {
  CrenditionalTypes,
  Client,
  User,
  ScopeTypes,
  UserCrenditionalRealtion,
  UserCrenditional,
} from "../src/model";
import { config } from "./config";

export function getSequelizeConfigure(
  models: ModelCtor<Model<any, any>>[],
): SequelizeOptions {
  return {
    models,
    ...(configure as SequelizeOptions),
    benchmark: process.env.NODE_ENV !== "production",
  };
}

/**
 * 첫 시스템 구성시 기본 계정 설정 함수
 */
export async function initialize() {
  const triggers = fs.readFileSync(path.join(__dirname, "query.sql"), "utf-8");

  sequelize.query(triggers);

  await Promise.all(
    config.user?.operator?.map(async (nUser) => {
      const transaction = await sequelize.transaction();
      try {
        const operator = await UserCrenditional.findOne({
          where: {
            username: nUser.username,
          },
          benchmark: process.env.NODE_ENV !== "production",
          transaction,
        });

        if (operator) {
          console.info(`Already exist ${nUser.username}`);
          await transaction.commit();

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

        await transaction.commit();
      } catch (e) {
        await transaction.rollback();
        console.error(e);

        throw e;
      }
    }) || [],
  );

  await Promise.all(
    config.client?.map(async (nClient) => {
      const checkClient = await Client.findOne({
        where: {
          clientId: nClient.clientId,
        },
        benchmark: process.env.NODE_ENV !== "production",
      });

      if (checkClient) {
        return;
      }

      try {
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
          },
        );
      } catch (e) {
        throw e;
      }
    }) || [],
  );
}
