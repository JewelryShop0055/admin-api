import {
  CountOptions,
  FindOptions,
  Op,
  VIRTUAL,
  WhereOptions,
} from "sequelize";
import {
  AutoIncrement,
  Column,
  HasMany,
  HasOne,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { filterToObject, paginationValidator } from "../util";
import CategoryTree from "./categroyTree";
import { ItemType, ItemTypeEnum } from "./itemType";
import ItemCategoryRelation from "./ItemCategoryRelation";
import { PaginationResponse, SearchMethod } from ".";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateCategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           description: Cateogry name.
 *           required: true
 *           type: string
 *           example: 목걸이
 *   requestBodies:
 *     CreateCategoryInput:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateCategoryInput"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: "#/components/schemas/CreateCategoryInput"
 */
export class CreateCategoryInput {
  type!: ItemType;
  name!: string;
  depth!: number;
}

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           description: "id of Catrgory"
 *           required: true
 *           type: "integer"
 *         name:
 *           description: "name of Catrgory"
 *           required: true
 *           type: "string"
 *         type:
 *             $ref: "#/components/schemas/ItemType"
 *         depth:
 *           description: "depth of Catrgory"
 *           required: true
 *           type: "integer"
 *         itemCount:
 *           description: "Has Item Count. only return on \"/v1/category/{itemType}\""
 *           required: false
 *           type: "integer"
 *         createdAt:
 *           $ref: "#/components/schemas/createdAt"
 *         updatedAt:
 *           $ref: "#/components/schemas/updatedAt"
 */
@Table({
  charset: "utf8",
  paranoid: false,
  hooks: {
    beforeDestroy: async (category: Category, options) => {
      const childTrees = await CategoryTree.findAll({
        where: {
          parentId: category.id,
        },
        transaction: options.transaction,
      });

      if (childTrees.length > 0) {
        await options.transaction?.rollback();
        throw new Error("Before remove Child Categorie");
      }
    },
  },
  indexes: [
    {
      type: "FULLTEXT",
      fields: ["name"],
    },
  ],
})
export class Category extends Model<Category, CreateCategoryInput> {
  @AutoIncrement
  @PrimaryKey
  @NotNull
  @Column({
    allowNull: false,
  })
  id!: number;

  @NotNull
  @Column({
    allowNull: false,
    type: ItemTypeEnum,
  })
  type!: ItemType;

  @NotNull
  @Column({
    allowNull: false,
  })
  name!: string;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  depth!: number;

  @Column(VIRTUAL)
  itemCount?: number;

  @HasOne(() => CategoryTree, {
    foreignKey: "childId",
    onDelete: "CASCADE",
    as: "parentTree",
  })
  parentTree?: CategoryTree;

  @HasMany(() => CategoryTree, {
    foreignKey: "parentId",
    onDelete: "CASCADE",
    as: "childTree",
  })
  childTree?: CategoryTree[];

  @HasMany(() => ItemCategoryRelation)
  itemRelations?: ItemCategoryRelation[];

  static search: SearchMethod<Category> = async ({
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

    const whereOptions: WhereOptions<Category>[] = keyword.reduce<
      WhereOptions<Category>[]
    >((p, k) => {
      p.push(
        ...[
          {
            name: {
              [Op.like]: `%${k}%`,
            },
          },
        ],
      );

      return p;
    }, []);

    const data = await Category.findAll(
      filterToObject<FindOptions<Category>>({
        ...options,
        where: {
          ...options?.where,
          [Op.or]: whereOptions.push(...options?.where?.[Op.or]),
        },
        offset,
        limit,
      }),
    );

    const totalItemCount = await Category.count(
      filterToObject<CountOptions<Category>>({
        where: {
          ...options?.where,
          [Op.or]: options?.where?.[Op.or]?.push(whereOptions) || whereOptions,
        },
      }),
    );

    return new PaginationResponse<Category>({
      data,
      currentPage,
      totalItemCount,
      limit,
    });
  };
}

export default Category;
