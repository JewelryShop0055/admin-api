import {
  Column,
  Model,
  PrimaryKey,
  Table,
  NotNull,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { UUIDV4, UUID } from "sequelize";
import {
  ItemTypeEnum,
  ItemType,
  ItemTypes,
  ItemUnitType,
  ItemUnitTypeEnum,
} from "./itemType";
import { v4 as uuidv4 } from "uuid";
import ItemCategoryRelation from "./ItemCategoryRelation";
import Category from "./category";
import { ItemUnitTypes } from "./itemType";
import ItemCraftShopRelation from "./itemCraftShopRelation";
import CraftShop from "./craftShop";
import { jsonIgnore } from "json-ignore";
import { ItemRelation } from "./ItemRelation";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateItemInput:
 *       type: object
 *       properties:
 *         type:
 *           $ref: "#/components/schemas/ItemType"
 *         partNo:
 *           description: Product management No. If Product type required.
 *           type: string
 *           required: false
 *         name:
 *           description: item name.
 *           type: string
 *           required: true
 *         unit:
 *           $ref: "#/components/schemas/ItemUnitType"
 *         defaultFee:
 *           description: 공임비.
 *           type: integer
 *           required: false
 *         extraFee:
 *           description: 기타 공임비(세공비 등).
 *           type: integer
 *           required: false
 *   requestBodies:
 *     CreateItemInput:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateItemInput"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: "#/components/schemas/CreateItemInput"
 */
export class CreateItemInput {
  type!: ItemType;
  partNo?: string;
  name!: string;
  unit!: ItemUnitType;
  defaultFee?: number;
  extraFee?: number;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Item:
 *       required: false
 *       type: object
 *       properties:
 *         id:
 *           description: Item Id.
 *           type: string
 *           required: true
 *         type:
 *           $ref: "#/components/schemas/ItemType"
 *         partNo:
 *           description: Product management No. If Product type required.
 *           type: string
 *           required: true
 *         name:
 *           description: item name.
 *           type: string
 *           required: true
 *         unit:
 *           $ref: "#/components/schemas/ItemUnitType"
 *         defaultFee:
 *           description: 공임비.
 *           type: integer
 *           required: true
 *         extraFee:
 *           description: 기타 공임비(세공비 등).
 *           type: integer
 *           required: true
 *         categories:
 *           type: array
 *           required: false
 *           items:
 *             $ref: "#/components/schemas/Category"
 *         createdAt:
 *           $ref: "#/components/schemas/createdAt"
 *         updatedAt:
 *           $ref: "#/components/schemas/updatedAt"
 *
 */
@Table({
  charset: "utf8",
  indexes: [
    {
      unique: true,
      name: "part_unique",
      fields: ["partNo"],
    },
  ],
  hooks: {
    beforeValidate: (item: Item) => {
      if (item.type === ItemTypes.parts) {
        if (!item.partNo || item.partNo === "") {
          item.partNo = uuidv4();
        }

        item.name = item.name?.trim();
        item.partNo = item.partNo?.trim();
      }
    },
  },
})
export class Item extends Model<Item, CreateItemInput> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  id!: string;

  @NotNull
  @Column({
    allowNull: false,
    type: ItemTypeEnum,
  })
  type!: ItemType;

  @Column
  @NotNull
  @Column({
    allowNull: false,
    unique: "part_unique",
  })
  partNo!: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  name!: string;

  @NotNull
  @Column({
    type: ItemUnitTypeEnum,
    allowNull: false,
    defaultValue: ItemUnitTypes.ea,
  })
  unit!: ItemUnitType;

  /**
   * 기본 공임비
   */
  @Column
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  defaultFee!: number;

  /**
   * 세공 공임비
   */
  @Column
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  extraFee!: number;

  @jsonIgnore()
  @Column
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: false,
  })
  disable!: boolean;

  @HasMany(() => ItemCategoryRelation, {
    onDelete: "CASCADE",
  })
  categoryRelations?: ItemCategoryRelation[];

  @BelongsToMany(() => Category, () => ItemCategoryRelation)
  categories?: Category[];

  @HasMany(() => ItemCraftShopRelation, {
    onDelete: "CASCADE",
  })
  craftShopRelations?: ItemCraftShopRelation[];

  @BelongsToMany(() => CraftShop, () => ItemCraftShopRelation)
  craftShops?: CraftShop[];

  @HasMany(() => ItemRelation, {
    onDelete: "CASCADE",
    foreignKey: "partsId",
    as: "productRelation",
  })
  productRelation?: ItemRelation[];

  @HasMany(() => ItemRelation, {
    onDelete: "CASCADE",
    foreignKey: "productId",
    as: "partsRelations",
  })
  partsRelations?: ItemRelation[];

  @BelongsToMany(() => Item, {
    through: () => ItemRelation,
    foreignKey: "productId",
    otherKey: "partsId",
    as: "parts",
  })
  parts?: Item[];

  @BelongsToMany(() => Item, {
    through: () => ItemRelation,
    foreignKey: "partsId",
    otherKey: "productId",
    as: "products",
  })
  products?: Item[];
}

export default Item;
