import { Model, ModelCtor, SequelizeOptions } from "sequelize-typescript";
import configure from "./sequelize.json";
import User from "../src/model/user";
import { ScopeTypes } from "../src/model/scope";
import sequelize, { UserCrenditionalRealtion } from "../src/model";
import UserCrenditional from "../src/model/userCreditional";
import Client from "../src/model/client";
import {
  CrenditionalType,
  CrenditionalTypes,
} from "../src/model/userCreditional";

export function getSequelizeConfigure(
  models: ModelCtor<Model<any, any>>[],
): SequelizeOptions {
  return {
    models,
    ...(configure as SequelizeOptions),
  };
}

export async function initialize() {
  const operator = await User.findOne({
    where: {
      scope: ScopeTypes.operator,
    },
  });

  if (!operator) {
    const transaction = await sequelize.transaction();

    try {
      const crenditional = await UserCrenditional.create(
        {
          password: "sh0pOperatorTmpPwd",
          username: "shopoperator",
          type: CrenditionalTypes.password,
        },
        {
          transaction,
        },
      );

      const user = await User.create(
        {
          email: "dummy@dummy.com",
          name: "운영자",
          phone: "010-0000-0000",
          scope: ScopeTypes.operator,
        },
        {
          transaction,
        },
      );

      const crenditionalRelation = await UserCrenditionalRealtion.create(
        {
          userId: user.id,
          crenditionalId: crenditional.id,
        },
        {
          transaction,
        },
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      console.error(e);

      throw e;
    }
  }

  const adminClient = await Client.findOne({
    where: {
      scope: ScopeTypes.operator,
    },
  });

  if (!adminClient) {
    try {
      await Client.create({
        name: "shop manager client",
        clientId: "shopClient",
        clientSecret: "shopClient1234",
        scope: ScopeTypes.operator,
        grants: ["password", "refresh_token"],
        redirectUris: ["http://localhost:3000/redirect"],
        accessTokenLifetime: 3600,
        refreshTokenLifetime: 7200,
      });
    } catch (e) {
      throw e;
    }
  }
}
