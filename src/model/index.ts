import { Model, ModelCtor, Sequelize } from "sequelize-typescript";
import { getSequelizeConfigure, initialize } from "../../configures/sequelize";

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
export * from "./itemResource";
export * from "./craftShop";
export * from "./itemCraftShopRelation";
export * from "./defaultErrorResponse";
export * from "./pagenationQuery";
export * from "./fileStatus";
export * from "./fileExt";

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
import ItemResource from "./itemResource";

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
  ItemResource,
] as ModelCtor<Model<any, any>>[];

export const sequelize = new Sequelize(getSequelizeConfigure(models));

export async function sync(isSync = false) {
  if (isSync) {
    await sequelize.sync().then(async () => {
      await initialize();
    });
  } else {
    console.log("Skip Sync");
  }
}

export default sequelize;
