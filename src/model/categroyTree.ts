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

  @BelongsTo(() => Category, "parentId")
  parent?: Category;

  @BelongsTo(() => Category, "childId")
  child?: Category;

  @BelongsTo(() => Category, "topId")
  top?: Category;
}

export default CategoryTree;
