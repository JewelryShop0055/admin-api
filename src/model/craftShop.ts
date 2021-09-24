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
 * @openapi
 *
 * components:
 *   schemas:
 *     CreateCraftShopInput:
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
 *         address:
 *           description: Craftshop address
 *           required: true
 *           type: string
 *           example: 경기 성남시 분당구 판교역로 235 (에이치스퀘어 엔동)
 *         detailAddresss:
 *           description: Craftshop detail address, like 동, 호
 *           required: true
 *           type: string
 *           example: 404호
 *         phone:
 *           description: Craftshop phone number
 *           required: true
 *           type: string
 *           example: "01012341234"
 *   requestBodies:
 *     CreateCraftShopInput:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateCraftShopInput"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: "#/components/schemas/CreateCraftShopInput"
 */
export class CreateCraftShoptInput {
  name!: string;
  postCode!: string;
  address!: string;
  detailAddress?: string;
  phone!: string;
}

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     CraftShop:
 *       type: object
 *       properties:
 *         id:
 *           description: Craftshop id
 *           required: true
 *           type: string
 *         name:
 *           description: Craftshop name
 *           required: true
 *           type: string
 *         postCode:
 *           description: Craftshop postcode
 *           required: true
 *           type: string
 *           example: 13494
 *         address:
 *           description: Craftshop address
 *           required: true
 *           type: string
 *           example: 경기 성남시 분당구 판교역로 235 (에이치스퀘어 엔동)
 *         detailAddresss:
 *           description: Craftshop detail address, like 동, 호
 *           required: true
 *           type: string
 *           example: 404호
 *         phone:
 *           description: Craftshop phone number
 *           required: true
 *           type: string
 *           example: "01012341234"
 *         createdAt:
 *           $ref: "#/components/schemas/createdAt"
 *         updatedAt:
 *           $ref: "#/components/schemas/updatedAt"
 */
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
  address!: string;

  @Column({})
  detailAddress?: string;

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
