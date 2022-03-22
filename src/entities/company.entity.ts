import {
  Column,
  NotNull,
  PrimaryKey,
  Table,
  Model,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import Item from "./item.entity";
import { UUID, UUIDV4 } from "sequelize";
import { CreateCompanyDto } from "../dto";
import ItemCompanyRelation from "./itemCompanyRelation.entry";
import { ENUM } from "sequelize";
import {
  CompanyTypeEnum,
  CompanyTypes,
  CompanyType,
} from "../types/companyType.type";

@Table({
  charset: "utf8",
  indexes: [
    {
      type: "FULLTEXT",
      fields: ["name", "address", "detailAddress", "phone"],
    },
  ],
})
export class Company extends Model<Company, CreateCompanyDto> {
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
    type: CompanyTypeEnum,
    defaultValue: CompanyTypes.craftshop,
    allowNull: false,
  })
  type!: CompanyType;

  @NotNull
  @Column({
    allowNull: false,
  })
  name!: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  postCode!: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  address!: string;

  @Column({})
  detailAddress?: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  phone!: string;

  @HasMany(() => ItemCompanyRelation, {
    onDelete: "CASCADE",
  })
  itemRelations?: ItemCompanyRelation[];

  @BelongsToMany(() => Item, () => ItemCompanyRelation)
  items?: Item[];
}

export default Company;
