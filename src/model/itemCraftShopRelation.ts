import {
  Column,
  NotNull,
  PrimaryKey,
  Table,
  Model,
  ForeignKey,
  Unique,
  BelongsTo,
} from "sequelize-typescript";
import { UUID, UUIDV4 } from "sequelize";
import CraftShop from "./craftShop";
import Item from "./item";

export class CreateItemCraftShopRelationInput {
  itemId!: string;
  craftShopid!: string;
}

@Table({
  charset: "utf8",
  indexes: [
    {
      unique: true,
      name: "item_unique",
      fields: ["itemId"],
    },
  ],
})
export class ItemCraftShopRelation extends Model<
  ItemCraftShopRelation,
  CreateItemCraftShopRelationInput
> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Unique
  @ForeignKey(() => Item)
  @NotNull
  @Column({
    allowNull: false,
    unique: "item_unique",
  })
  itemId!: string;

  @ForeignKey(() => CraftShop)
  @NotNull
  @Column({
    allowNull: false,
  })
  craftShopid!: string;

  @BelongsTo(() => Item, "itemId")
  item?: Item;

  @BelongsTo(() => CraftShop, "craftShopid")
  craftShop?: CraftShop;
}

export default ItemCraftShopRelation;
