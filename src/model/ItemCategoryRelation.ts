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

@Table({
  charset: "utf8",
})
export class ItemCategoryRelation extends Model<ItemCategoryRelation> {
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
    validate: {
      isUUID: 4,
      notNull: true,
    },
  })
  itemId!: string;

  @ForeignKey(() => Category)
  @NotNull
  @Column({
    allowNull: false,
    validate: {
      isNumeric: true,
      min: 1,
      isNull: false,
    },
  })
  categoryId!: number;

  @BelongsTo(() => Item)
  item?: Item;

  @BelongsTo(() => Category)
  category?: Category;
}

export default ItemCategoryRelation;
