import { UUID, UUIDV4 } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Category from "./category.entity";
import Item from "./item.entity";

export class CreateItemCategoryInput {
  item!: Item;
  category!: Category;
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
    defaultValue: UUIDV4,
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
