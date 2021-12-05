import { jsonIgnore } from "json-ignore";
import {
  CountOptions,
  FindOptions,
  Op,
  TEXT,
  UUID,
  UUIDV4,
  WhereOptions,
} from "sequelize";
import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

import { Category } from "./category";
import { CraftShop } from "./craftShop";
import { ItemCategoryRelation } from "./ItemCategoryRelation";
import { ItemCraftShopRelation } from "./itemCraftShopRelation";
import { ItemRelation } from "./ItemRelation";
import { PaginationResponse } from "./paginationResponse";
import { SearchMethod } from "./searchMethod";
import {
  ItemType,
  ItemTypeEnum,
  ItemTypes,
  ItemUnitType,
  ItemUnitTypeEnum,
  ItemUnitTypes,
} from "./itemType";
import { filterToObject, paginationValidator } from "../util";

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
 *         isRev:
 *           description: 파생 모델 여부
 *           type: boolean
 *           required: false
 *         categoryId:
 *           description: 카테고리 ID
 *           type: integer
 *           required: false
 *         craftShopId:
 *           description: 공방 ID
 *           type: string
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
  memo?: string;
  displayable?: boolean;
  soldOut?: boolean;
  revNo?: number;
}

export class CreateItemWithOption {
  isRev?: boolean;
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
 *         displayble:
 *           description: B2C 페이지 표시 여부.
 *           type: boolean
 *           required: true
 *         soldOut:
 *           description: 품절
 *           type: boolean
 *           required: true
 *         memo:
 *           description: 메모
 *           type: string
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
      fields: ["partNo", "revNo"],
    },
    {
      type: "FULLTEXT",
      fields: ["name", "partNo", "memo"],
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

  @Column
  @NotNull
  @Column({
    allowNull: false,
    unique: "part_unique",
    defaultValue: 0,
  })
  revNo!: number;

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
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  defaultFee!: number;

  /**
   * 세공 공임비
   */
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  extraFee!: number;

  @jsonIgnore()
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: false,
  })
  disable!: boolean;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: false,
  })
  displayable!: boolean;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: false,
  })
  soldOut!: boolean;

  @Column({
    type: TEXT,
    allowNull: true,
    defaultValue: "",
  })
  memo?: string;

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

  static search: SearchMethod<Item> = async ({
    keywords: keyword,
    findOptions: options,
    page,
    limit: _limit,
  }) => {
    const { currentPage, limit, offset } = paginationValidator(
      page,
      _limit,
      30,
    );

    const whereOptions: WhereOptions<Item>[] = keyword.reduce<
      WhereOptions<Item>[]
    >((p, k) => {
      p.push(
        ...[
          {
            name: {
              [Op.like]: `%${k}%`,
            },
          },
          {
            partNo: {
              [Op.like]: `%${k}%`,
            },
          },
          {
            memo: {
              [Op.like]: `%${k}%`,
            },
          },
        ],
      );

      return p;
    }, []);

    const data = await Item.findAll(
      filterToObject<FindOptions<Item>>({
        ...options,
        where: {
          ...options?.where,
          [Op.or]: options?.where?.[Op.or]?.push(whereOptions) || whereOptions,
        },
        offset,
        limit,
      }),
    );

    const totalItemCount = await Item.count(
      filterToObject<CountOptions<Item>>({
        where: {
          ...options?.where,
          [Op.or]: options?.where?.[Op.or]?.push(whereOptions) || whereOptions,
        },
      }),
    );

    return new PaginationResponse<Item>({
      data,
      currentPage,
      totalItemCount,
      limit,
    });
  };
}

export default Item;
