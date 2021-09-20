import {
  Column,
  Model,
  PrimaryKey,
  Table,
  NotNull,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { UUIDV4, UUID } from "sequelize";
import {
  ItemTypeEnum,
  ItemType,
  ItemTypes,
  ItemUnitType,
  ItemUnitTypeEnum,
} from "./itemType";
import { v4 as uuidv4 } from "uuid";
import ItemCategoryRelation from "./ItemCategoryRelation";
import Category from "./category";
import { ItemUnitTypes } from "./itemType";
import ItemCraftShopRelation from "./itemCraftShopRelation";
import CraftShop from "./craftShop";

export class CreateItemInput {
  type!: ItemType;
  partNo?: string;
  name!: string;
}

@Table({
  charset: "utf8",
  indexes: [
    {
      unique: true,
      name: "part_unique",
      fields: ["partNo"],
    },
  ],
  hooks: {
    beforeValidate: (item: Item) => {
      if (item.type === ItemTypes.parts) {
        if (!item.partNo || item.partNo === "") {
          item.partNo = uuidv4();
        }

        item.name = item.name?.trim();
        item.partNo = item.partNo?.trim();
      }
    },
  },
})
export class Item extends Model<Item, CreateItemInput> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  id!: string;

  @NotNull
  @Column({
    allowNull: false,
    type: ItemTypeEnum,
  })
  type!: ItemType;

  @Column
  @NotNull
  @Column({
    allowNull: false,
    unique: "part_unique",
  })
  partNo!: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  name!: string;

  @NotNull
  @Column({
    type: ItemUnitTypeEnum,
    allowNull: false,
    defaultValue: ItemUnitTypes.ea,
  })
  unit!: ItemUnitType;

  /**
   * 기본 공임비
   */
  @Column
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  defaultFee!: number;

  /**
   * 세공 공임비
   */
  @Column
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  extraFee!: number;

  @Column
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: false,
  })
  disable!: boolean;

  @HasMany(() => ItemCategoryRelation, {
    onDelete: "CASCADE",
  })
  categoryRelations?: ItemCategoryRelation[];

  @BelongsToMany(() => Category, () => ItemCategoryRelation)
  categories?: Category[];

  @HasMany(() => ItemCraftShopRelation, {
    onDelete: "CASCADE",
  })
  craftShopRelations?: ItemCraftShopRelation[];

  @BelongsToMany(() => CraftShop, () => ItemCraftShopRelation)
  craftShops?: CraftShop[];
}

export default Item;
