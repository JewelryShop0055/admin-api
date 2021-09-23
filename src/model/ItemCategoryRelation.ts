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
import Item from "./item";

export class CreateItemCategoryInput {
  itemId!: string;
  categoryId!: number;
}

@Table({
  charset: "utf8",
})
export class ItemCategoryRelation extends Model<
  ItemCategoryRelation,
  CreateItemCategoryInput
> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Item)
  @NotNull
  @Column({
    allowNull: false,
  })
  itemId!: string;

  @ForeignKey(() => Category)
  @NotNull
  @Column({
    allowNull: false,
  })
  categoryId!: number;

  @BelongsTo(() => Item)
  item?: Item;

  @BelongsTo(() => Category)
  category?: Category;
}

export default ItemCategoryRelation;
