import { Model, ModelCtor, SequelizeOptions } from "sequelize-typescript";
import configure from "./sequelize.json";
import sequelize, {
  CrenditionalTypes,
  Client,
  User,
  ScopeTypes,
  UserCrenditionalRealtion,
  UserCrenditional,
} from "../src/model";

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
 *
 * 1. 유저
 * 관리자 권한을 가진 아래 계정 생성
 * username: shopoperator
 * PW: sh0pOperatorTmpPwd
 *
 * 2. 클라이언트(매장 관리 클라이언트)
 * 관리자 권한을 가진 아래 클라이언트 생성
 *
 * client id: shopClient
 * client secret: shopClient1234
 *
 * 초기화 이후 유저 비밀번호 변경 반드시 할것
 * 클라이언트의 경우 "client secret" DB에서 유추하기 어려운 것으로 반드시 변경
 */
export async function initialize() {
  const operator = await User.findOne({
    where: {
      scope: ScopeTypes.operator,
    },
    benchmark: process.env.NODE_ENV !== "production",
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
          benchmark: process.env.NODE_ENV !== "production",
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
  }

  const adminClient = await Client.findOne({
    where: {
      scope: ScopeTypes.operator,
    },
    benchmark: process.env.NODE_ENV !== "production",
  });

  if (!adminClient) {
    try {
      await Client.create(
        {
          name: "shop manager client",
          clientId: "shopClient",
          clientSecret: "shopClient1234",
          scope: ScopeTypes.operator,
          grants: ["password", "refresh_token"],
          redirectUris: ["http://localhost:3000/redirect"],
          accessTokenLifetime: 3600,
          refreshTokenLifetime: 7200,
        },
        {
          benchmark: process.env.NODE_ENV !== "production",
        },
      );
    } catch (e) {
      throw e;
    }
  }
}
