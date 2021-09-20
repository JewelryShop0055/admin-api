import {
  Column,
  NotNull,
  PrimaryKey,
  Table,
  Model,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { UUID, UUIDV4 } from "sequelize";
import ItemCraftShopRelation from "./itemCraftShopRelation";
import Item from "./item";

/**
 * components:
 *   schema:
 *     CreateCraftShoptInput:
 *       type: object
 *       properties:
 *         name:
 *           description: Craftshop name
 *           required: true
 *           type: string
 *         postCode:
 *           description: Craftshop postcode
 *           required: true
 *           type: string
 *           example: 13494
 *         addresss:
 *           description: Craftshop addresss
 *           required: true
 *           type: string
 *           example: 경기 성남시 분당구 판교역로 235 (에이치스퀘어 엔동)
 *         detailAddresss:
 *           description: Craftshop detail addresss, like 동, 호
 *           required: true
 *           type: string
 *           example: 404호
 *         phone:
 *           description: Craftshop phone number
 *           required: true
 *           type: string
 *           example: 01012341234

 */
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

  @HasMany(() => ItemCraftShopRelation, {
    onDelete: "CASCADE",
  })
  itemRelations?: ItemCraftShopRelation[];

  @BelongsToMany(() => Item, () => ItemCraftShopRelation)
  items?: Item[];
}

export default CraftShop;
