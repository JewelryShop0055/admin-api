import { UUID } from "sequelize";
import {
  Column,
  Model,
  PrimaryKey,
  Table,
  NotNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Item from "./item";

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     CreateItemRealtionInput:
 *       type: object
 *       properties:
 *         partsId:
 *           description: Parts Item id
 *           required: true
 *           type: string
 *         amount:
 *           description: Parts Amount for Product
 *           required: true
 *           type: number
 *           format: float
 *           example: 3.14
 */
export class CreateItemRealtionInput {
  productId!: string;
  partsId!: string;
  amount!: number;
}

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     ItemRelation:
 *       type: object
 *       properties:
 *         productId:
 *           description: Product Item id
 *           required: true
 *           type: string
 *         partsId:
 *           description: Parts Item id
 *           required: true
 *           type: string
 *         amount:
 *           description: Parts Amount for Product
 *           required: true
 *           type: number
 *           format: float
 *           example: 3.14
 *         product:
 *           $ref: "#/components/schemas/Item"
 *         parts:
 *           $ref: "#/components/schemas/Item"
 *         createdAt:
 *           $ref: "#/components/schemas/createdAt"
 *         updatedAt:
 *           $ref: "#/components/schemas/updatedAt"
 */
@Table({
  charset: "utf8",
})
export class ItemRelation extends Model<ItemRelation> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Item)
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
  })
  productId!: string;

  @ForeignKey(() => Item)
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
  })
  partsId!: string;

  @BelongsTo(() => Item, "productId")
  product?: Item;

  @BelongsTo(() => Item, "partsId")
  parts?: Item;
}

export default ItemRelation;
