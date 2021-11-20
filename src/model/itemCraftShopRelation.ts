import { UUID, UUIDV4 } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

import { CraftShop } from "./craftShop";
import { Item } from "./item";

export class CreateItemCraftShopRelationInput {
  itemId!: string;
  craftShopId!: string;
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
  craftShopId!: string;

  @BelongsTo(() => Item, "itemId")
  item?: Item;

  @BelongsTo(() => CraftShop, "craftShopId")
  craftShop?: CraftShop;
}

export default ItemCraftShopRelation;
