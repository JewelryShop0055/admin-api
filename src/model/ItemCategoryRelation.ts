import { UUID } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { Category } from "./category";
import { Item } from "./item";

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
