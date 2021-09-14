import CategoryTree from "./categroyTree";
import { ItemType, ItemTypeEnum } from "./itemType";
import {
  Column,
  Model,
  PrimaryKey,
  Table,
  NotNull,
  AutoIncrement,
  HasOne,
  HasMany,
} from "sequelize-typescript";

@Table({
  charset: "utf8",
})
export class Category extends Model<Category> {
  @AutoIncrement
  @PrimaryKey
  @NotNull
  @Column({
    allowNull: false,
  })
  id!: number;

  @NotNull
  @Column({
    allowNull: false,
    type: ItemTypeEnum,
    validate: {
      notEmpty: true,
      isNull: false,
    },
  })
  type!: ItemType;

  @NotNull
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
      isNull: false,
    },
  })
  name!: string;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true,
      isNull: false,
    },
  })
  depth!: number;

  @HasOne(() => CategoryTree, "childId")
  parentTree?: CategoryTree;

  @HasMany(() => CategoryTree, "parentId")
  childTree?: CategoryTree[];
}

export default Category;
