import {
  Column,
  NotNull,
  PrimaryKey,
  Table,
  Model,
} from "sequelize-typescript";
import { UUID, UUIDV4 } from "sequelize";

export class CreateCraftShoptInput {
  name!: string;
  postCode!: string;
  addresss!: string;
  detailAddresss?: string;
  phone!: string;
}

@Table({
  charset: "utf8",
  indexes: [],
})
export class CraftShop extends Model<CraftShop, CreateCraftShoptInput> {
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
  addresss!: string;

  @Column({})
  detailAddresss?: string;

  @NotNull
  @Column({
    allowNull: false,
  })
  phone!: string;
}

export default CraftShop;
