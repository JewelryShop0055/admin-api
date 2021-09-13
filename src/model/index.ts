import { Model, ModelCtor, Sequelize } from "sequelize-typescript";
import { getSequelizeConfigure, initialize } from "../../configures";
///import your models
// import foo from "./foo";

//export your models
// export * from "./foo";

export * from "./user";
export * from "./userCrenditionalRelation";
export * from "./userCreditional";
export * from "./userTokens";
export * from "./client";
export * from "./scope";

import User from "./user";
import UserCrenditionalRelation from "./userCrenditionalRelation";
import UserCreditional from "./userCreditional";
import UserToken from "./userTokens";
import Client from "./client";

const models = [
  User,
  UserCrenditionalRelation,
  UserCreditional,
  UserToken,
  Client,
] as ModelCtor<Model<any, any>>[];

export const sequelize = new Sequelize(getSequelizeConfigure(models));
sequelize.sync();
initialize();

export default sequelize;
