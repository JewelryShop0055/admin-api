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

@Table({
  charset: "utf8",
})
export class CategoryTree extends Model<CategoryTree> {
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
  })
  parentId!: number;

  @ForeignKey(() => Category)
  @NotNull
  @Column({
    allowNull: false,
  })
  childId!: number;

  /**
   * 자식의 Depth와 동일해야함
   */
  @NotNull
  @Column({
    allowNull: false,
  })
  depth!: number;

  @BelongsTo(() => Category, "parentId")
  parent?: Category;

  @BelongsTo(() => Category, "childId")
  child?: Category;
}

export default CategoryTree;
