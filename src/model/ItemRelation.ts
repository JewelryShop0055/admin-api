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
import Item from "./item";

@Table({
  charset: "utf8",
})
export class ItemRelation extends Model<ItemRelation> {
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
    type: UUID,
    allowNull: false,
  })
  productId!: string;

  @ForeignKey(() => Item)
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
  })
  partsId!: string;

  @BelongsTo(() => Item, "productId")
  product?: Item;

  @BelongsTo(() => Item, "partsId")
  parts?: Item;
}

export default ItemRelation;
