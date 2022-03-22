import { ApiProperty } from "@nestjs/swagger";
import { VIRTUAL } from "sequelize";
import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { CreateCategoryDto } from "../dto";
import { ItemType, ItemTypeEnum } from "../types";
import ItemCategoryRelation from "./ItemCategoryRelation.entry";

@Table({
  charset: "utf8",
  paranoid: false,
  indexes: [
    {
      type: "FULLTEXT",
      fields: ["name"],
    },
  ],
})
export class Category extends Model<Category, CreateCategoryDto> {
  @ApiProperty()
  @AutoIncrement
  @PrimaryKey
  @NotNull
  @Column({
    allowNull: false,
  })
  id!: number;

  @ApiProperty()
  @NotNull
  @Column({
    allowNull: false,
    type: ItemTypeEnum,
  })
  type!: ItemType;

  @ApiProperty()
  @NotNull
  @Column({
    allowNull: false,
  })
  name!: string;

  @ApiProperty()
  @Column(VIRTUAL)
  itemCount?: number;

  @HasMany(() => ItemCategoryRelation)
  itemRelations?: ItemCategoryRelation[];
}

export default Category;
