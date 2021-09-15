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
export * from "./ItemRelation";

import User from "./user";
import UserCrenditionalRelation from "./userCrenditionalRelation";
import UserCreditional from "./userCreditional";
import UserToken from "./userTokens";
import Client from "./client";
import Item from "./item";
import Category from "./category";
import CategoryTree from "./categroyTree";
import ItemCategoryRelation from "./ItemCategoryRelation";
import ItemRelation from "./ItemRelation";

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
  ItemRelation,
] as ModelCtor<Model<any, any>>[];

export const sequelize = new Sequelize(getSequelizeConfigure(models));
sequelize.sync().then(async () => {
  await initialize();
});

export default sequelize;
