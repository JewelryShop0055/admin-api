import { UUID, UUIDV1, JSON } from "sequelize";
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
import { ApiProperty, ApiHideProperty } from "@nestjs/swagger";
import { CreateItemResourceDto } from "../dto";
import {
  ItemFileType,
  ItemFileTypes,
  ItemFileTypeEnum,
  ResourcePath,
} from "../types";
import { Item } from "./item.entity";

@Table({
  charset: "utf8",
  paranoid: false,
})
export class ItemResource extends Model<ItemResource, CreateItemResourceDto> {
  @Unique("uniq_resource")
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    defaultValue: UUIDV1,
    allowNull: false,
  })
  @ApiProperty()
  id!: string;

  @NotNull
  @Column({
    allowNull: false,
    type: ItemFileTypeEnum,
  })
  @ApiProperty({
    enumName: "ItemFileType",
    enum: Object.keys(ItemFileTypes).map((v) => ItemFileTypes[v]),
  })
  type!: ItemFileType;

  @Unique("uniq_resource")
  @ForeignKey(() => Item)
  @NotNull
  @Column({
    allowNull: false,
    type: UUID,
  })
  @ApiProperty({})
  itemId!: string;

  //TODO: add format list
  @NotNull
  @Column({
    allowNull: false,
    type: JSON,
  })
  @ApiHideProperty()
  paths!: ResourcePath;

  @NotNull
  @Column({
    allowNull: false,
  })
  @ApiProperty({})
  order!: number;

  @BelongsTo(() => Item, "itemId")
  item?: Item;
}

export default ItemResource;
