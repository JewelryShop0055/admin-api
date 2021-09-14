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
export * from "./item";
export * from "./itemType";
export * from "./category";
export * from "./categroyTree";
export * from "./ItemCategoryRelation";

import User from "./user";
import UserCrenditionalRelation from "./userCrenditionalRelation";
import UserCreditional from "./userCreditional";
import UserToken from "./userTokens";
import Client from "./client";
import Item from "./item";
import Category from "./category";
import CategoryTree from "./categroyTree";
import ItemCategoryRelation from "./ItemCategoryRelation";

const models = [
  User,
  UserCrenditionalRelation,
  UserCreditional,
  UserToken,
  Client,
  Item,
  ItemCategoryRelation,
  Category,
  CategoryTree,
] as ModelCtor<Model<any, any>>[];

export const sequelize = new Sequelize(getSequelizeConfigure(models));
sequelize.sync();
initialize();

export default sequelize;
