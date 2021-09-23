import { UUID } from "sequelize";
import {
  Column,
  Model,
  PrimaryKey,
  Table,
  NotNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Category } from ".";

export class CreateCategoryTreeInput {
  parentId!: number;
  childId!: number;
  topId!: number;
  depth!: number;
}

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     CategoryTree:
 *       type: object
 *       properties:
 *         id:
 *           description: "id of Category Tree"
 *           required: true
 *           type: "integer"
 *         parentId:
 *           description: "Parent Catrgory ID. may Top Category's Parent ID is Must '0'"
 *           required: true
 *           type: "number"
 *         topId:
 *           description: "Parent Catrgory ID. may Top Category's Parent ID is Must '0'"
 *           required: true
 *           type: "number"
 *         childId:
 *           description: "Child Catrgory ID"
 *           required: true
 *           type: "number"
 *         depth:
 *           description: "depth of Catrgory Tree, this value is equel Category.depth"
 *           required: true
 *           type: "integer"
 *           min: 0
 *         createdAt:
 *           description: "Created Date of Catrgory Tree"
 *           required: true
 *           type: "string"
 *           format: date
 *         updatedAt:
 *           description: "Last Modified Date of Catrgory Tree"
 *           required: false
 *           type: "string"
 *           format: date
 */
@Table({
  charset: "utf8",
  hooks: {
    beforeValidate: (tree: CategoryTree, _options) => {
      if (
        (tree.depth !== 0 && (tree.parentId === 0 || tree.topId == 0)) ||
        (tree.depth === 0 && (tree.parentId !== 0 || tree.topId !== 0))
      ) {
        throw new Error("Invalidate Category Depth");
      }
    },
  },
})
export class CategoryTree extends Model<CategoryTree, CreateCategoryTreeInput> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Category)
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  parentId!: number;

  @ForeignKey(() => Category)
  @NotNull
  @Column({
    allowNull: false,
  })
  childId!: number;

  @ForeignKey(() => Category)
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  topId!: number;

  /**
   * 자식의 Depth와 동일해야함
   */
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  depth!: number;

  @BelongsTo(() => Category, {
    foreignKey: "parentId",
    as: "parent",
  })
  parent?: Category;

  @BelongsTo(() => Category, {
    foreignKey: "childId",
    as: "child",
  })
  child?: Category;

  @BelongsTo(() => Category, {
    foreignKey: "topId",
    as: "top",
  })
  top?: Category;
}

export default CategoryTree;
