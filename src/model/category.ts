import CategoryTree from "./categroyTree";
import { ItemType, ItemTypeEnum } from "./itemType";
import {
  Column,
  Model,
  PrimaryKey,
  Table,
  NotNull,
  AutoIncrement,
  HasOne,
  HasMany,
} from "sequelize-typescript";

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
 *       description: A JSON object containing item data
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
 *         createdAt:
 *           description: "Created Date of Catrgory"
 *           required: true
 *           type: "string"
 *           format: date
 *         updatedAt:
 *           description: "Last Modified Date of Catrgory"
 *           required: false
 *           type: "string"
 *           format: date
 */
@Table({
  charset: "utf8",
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

  @HasOne(() => CategoryTree, {
    foreignKey: "childId",
    onDelete: "CASCADE",
  })
  parentTree?: CategoryTree;

  @HasMany(() => CategoryTree, {
    foreignKey: "parentId",
    onDelete: "CASCADE",
  })
  childTree?: CategoryTree[];
}

export default Category;
