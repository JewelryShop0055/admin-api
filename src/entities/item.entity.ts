import { TEXT, UUID, UUIDV4, DataTypes } from "sequelize";
import {
  BelongsToMany,
  Column,
  HasMany,
  Index,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { CreateItemDto } from "../dto";
import {
  ItemType,
  ItemTypeEnum,
  ItemTypes,
  ItemUnitType,
  ItemUnitTypeEnum,
  ItemUnitTypes,
} from "../types";
import { Category } from "./category.entity";
import { Company } from "./company.entity";
import { ItemCategoryRelation } from "./ItemCategoryRelation.entry";
import { ItemCompanyRelation } from "./itemCompanyRelation.entry";
import { ItemRelation } from "./itemRelation.entity";
import { ApiProperty, ApiHideProperty } from "@nestjs/swagger";
import { ItemResource } from "./itemResource.entity";

@Table({
  charset: "utf8",
  paranoid: true,
  hooks: {
    beforeValidate: (item: Item) => {
      if (item.type === ItemTypes.parts) {
        if (!item.partNo || item.partNo === "") {
          item.partNo = uuidv4();
        }
      }

      item.name = item.name?.trim();
      item.partNo = item.partNo?.trim();
    },
  },
  defaultScope: {
    attributes: {
      exclude: ["tsvector", "deletedAt"],
    },
  },
})
export class Item extends Model<Item, CreateItemDto> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  @ApiProperty()
  id!: string;

  @NotNull
  @Column({
    allowNull: false,
    type: ItemTypeEnum,
  })
  @ApiProperty({
    enumName: "ItemTypeEnum",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  type!: ItemType;

  @NotNull
  @Column({
    allowNull: false,
    unique: "part_unique",
  })
  @Index({
    unique: true,
    name: "part_unique",
  })
  @ApiProperty()
  partNo!: string;

  @NotNull
  @Column({
    allowNull: false,
    unique: "part_unique",
    defaultValue: 0,
  })
  @Index({
    unique: true,
    name: "part_unique",
  })
  @ApiProperty()
  revNo!: number;

  @NotNull
  @Column({
    allowNull: false,
  })
  @ApiProperty()
  name!: string;

  @NotNull
  @Column({
    type: ItemUnitTypeEnum,
    allowNull: false,
    defaultValue: ItemUnitTypes.ea,
  })
  @ApiProperty({
    enumName: "ItemUnitType",
    enum: Object.keys(ItemUnitTypes).map((v) => ItemUnitTypes[v]),
  })
  unit!: ItemUnitType;

  /**
   * 기본 공임비
   */
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  defaultFee!: number;

  /**
   * 세공 공임비
   */
  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  extraFee!: number;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  displayable!: boolean;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  soldOut!: boolean;

  @Column({
    type: TEXT,
    allowNull: true,
    defaultValue: "",
  })
  @ApiProperty()
  memo?: string;

  @Column(DataTypes.TSVECTOR)
  @Index({
    name: "item_search",
    type: "FULLTEXT",
    using: "GIN",
  })
  @ApiHideProperty()
  tsvector?: unknown;

  @HasMany(() => ItemCategoryRelation, {
    onDelete: "CASCADE",
  })
  categoryRelations?: ItemCategoryRelation[];

  @BelongsToMany(() => Category, () => ItemCategoryRelation)
  categories?: Category[];

  @HasMany(() => ItemCompanyRelation, {
    onDelete: "CASCADE",
  })
  companyRelations?: ItemCompanyRelation[];

  @BelongsToMany(() => Company, () => ItemCompanyRelation)
  companys?: Company[];

  @HasMany(() => ItemRelation, {
    onDelete: "CASCADE",
    foreignKey: "partsId",
    as: "productRelation",
  })
  productRelation?: ItemRelation[];

  @HasMany(() => ItemRelation, {
    onDelete: "CASCADE",
    foreignKey: "productId",
    as: "partsRelations",
  })
  partsRelations?: ItemRelation[];

  @HasMany(() => ItemResource, {
    onDelete: "CASCADE",
    foreignKey: "itemId",
  })
  resources?: ItemResource[];

  @BelongsToMany(() => Item, {
    through: () => ItemRelation,
    foreignKey: "productId",
    otherKey: "partsId",
    as: "parts",
  })
  parts?: Item[];

  @BelongsToMany(() => Item, {
    through: () => ItemRelation,
    foreignKey: "partsId",
    otherKey: "productId",
    as: "products",
  })
  products?: Item[];
}

export default Item;
