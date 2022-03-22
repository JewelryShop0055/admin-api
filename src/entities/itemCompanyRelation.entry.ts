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
import { CreateItemCompanyRelationDto } from "../dto";
import Company from "./company.entity";
import Item from "./item.entity";

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
export class ItemCompanyRelation extends Model<
  ItemCompanyRelation,
  CreateItemCompanyRelationDto
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

  @ForeignKey(() => Company)
  @NotNull
  @Column({
    allowNull: false,
  })
  companyId!: string;

  @BelongsTo(() => Item, "itemId")
  item?: Item;

  @BelongsTo(() => Company, "companyId")
  company?: Company;
}

export default ItemCompanyRelation;
