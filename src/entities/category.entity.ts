import { ApiProperty, ApiHideProperty } from "@nestjs/swagger";
import { VIRTUAL, DataTypes } from "sequelize";
import {
  AutoIncrement,
  Column,
  HasMany,
  Index,
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
  paranoid: true,
  hooks: {
    beforeValidate: (item: Category) => {
      item.name = item.name?.trim();
    },
  },
  defaultScope: {
    attributes: {
      exclude: ["tsvector", "deletedAt"],
    },
  },
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

  @Column(DataTypes.TSVECTOR)
  @Index({
    name: "category_search",
    type: "FULLTEXT",
    using: "GIN",
  })
  @ApiHideProperty()
  tsvector?: unknown;

  @HasMany(() => ItemCategoryRelation)
  itemRelations?: ItemCategoryRelation[];
}

export default Category;
