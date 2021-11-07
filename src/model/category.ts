import { FindOptions, INTEGER, Op, VIRTUAL, WhereOptions } from "sequelize";
import {
  AutoIncrement,
  BelongsToMany,
  Column,
  HasMany,
  HasOne,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { filterToObject } from "../util";
import CategoryTree from "./categroyTree";
import { ItemType, ItemTypeEnum } from "./itemType";
import ItemCategoryRelation from "./ItemCategoryRelation";
import Item from "./item";

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
 *           min: 0
 *         itemCount:
 *           description: "Has Item Count. only return on \"/admin/category/{itemType}\""
 *           required: false
 *           type: "integer"
 *           min: 0
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

  static async search(
    keyword: string[],
    options?: FindOptions<Category>,
  ): Promise<Category[]> {
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

    return Category.findAll(
      filterToObject<FindOptions<Category>>({
        ...options,
        where: {
          ...options?.where,
          [Op.or]: whereOptions.push(...options?.where?.[Op.or]),
        },
      }),
    );
  }
}

export default Category;
