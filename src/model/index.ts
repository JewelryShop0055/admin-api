import { Model, ModelCtor, Sequelize } from "sequelize-typescript";
import { getSequelizeConfigure, initialize } from "../../configures";

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
export * from "./craftShop";
export * from "./itemCraftShopRelation";
export * from "./defaultErrorResponse";

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
import CraftShop from "./craftShop";
import ItemCraftShopRelation from "./itemCraftShopRelation";

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
  CraftShop,
  ItemCraftShopRelation,
] as ModelCtor<Model<any, any>>[];

export const sequelize = new Sequelize(getSequelizeConfigure(models));
sequelize.sync().then(async () => {
  await initialize();
});

export default sequelize;
