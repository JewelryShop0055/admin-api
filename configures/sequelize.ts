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
