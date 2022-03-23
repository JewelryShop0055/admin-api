import {
  Column,
  NotNull,
  PrimaryKey,
  Table,
  Model,
  BelongsToMany,
  HasMany,
  Index,
} from "sequelize-typescript";
import Item from "./item.entity";
import { UUID, UUIDV4, DataTypes } from "sequelize";
import { CreateCompanyDto } from "../dto";
import { ItemCompanyRelation } from "./itemCompanyRelation.entry";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import {
  CompanyTypeEnum,
  CompanyTypes,
  CompanyType,
} from "../types/companyType.type";

@Table({
  charset: "utf8",
  paranoid: true,
  hooks: {
    beforeValidate: (item: Company) => {
      item.name = item.name?.trim();
      item.postCode = item.postCode?.trim();
      item.address = item.address?.trim();
      item.detailAddress = item.detailAddress?.trim();
      item.phone = item.phone?.trim();
    },
  },
  defaultScope: {
    attributes: {
      exclude: ["tsvector", "deletedAt"],
    },
  },
})
export class Company extends Model<Company, CreateCompanyDto> {
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
    type: CompanyTypeEnum,
    defaultValue: CompanyTypes.craftshop,
    allowNull: false,
  })
  @ApiProperty({
    enumName: "CompanyTypeEnum",
    enum: Object.keys(CompanyTypes).map((v) => CompanyTypes[v]),
  })
  type!: CompanyType;

  @NotNull
  @Column({
    allowNull: false,
  })
  @ApiProperty()
  name!: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  @ApiProperty()
  postCode!: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  @ApiProperty()
  address!: string;

  @Column({})
  @ApiProperty()
  detailAddress?: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  @ApiProperty()
  phone!: string;

  @Column(DataTypes.TSVECTOR)
  @Index({
    name: "company_search",
    type: "FULLTEXT",
    using: "GIN",
  })
  @ApiHideProperty()
  tsvector?: unknown;

  @HasMany(() => ItemCompanyRelation, {
    onDelete: "CASCADE",
  })
  itemRelations?: ItemCompanyRelation[];

  @BelongsToMany(() => Item, () => ItemCompanyRelation)
  items?: Item[];
}

export default Company;
