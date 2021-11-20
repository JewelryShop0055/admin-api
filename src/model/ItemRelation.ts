import { FLOAT, TEXT, UUID } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { Item } from "./item";
import { ItemTypes } from "./itemType";

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
  memo?: string;
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
  hooks: {
    beforeCreate: async (relation: ItemRelation, options) => {
      const product = await Item.findOne({
        where: {
          type: ItemTypes.product,
          id: relation.productId,
        },
        transaction: options.transaction,
      });

      if (!product) {
        await options.transaction?.rollback();
        throw new Error(
          "Invalidate `productId`. Not exist product or target type is not `product`",
        );
      }

      const parts = await Item.findOne({
        where: {
          type: ItemTypes.parts,
          id: relation.partsId,
        },
        transaction: options.transaction,
      });

      if (!parts) {
        await options.transaction?.rollback();
        throw new Error(
          "Invalidate `partsId`. Not exist parts or target type is not `parts`",
        );
      }
    },
  },
})
export class ItemRelation extends Model<ItemRelation, CreateItemRealtionInput> {
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

  @Column({
    type: FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  amount!: number;

  @Column
  @Column({
    type: TEXT,
    allowNull: true,
    defaultValue: "",
  })
  memo?: string;

  @BelongsTo(() => Item, "productId")
  product?: Item;

  @BelongsTo(() => Item, "partsId")
  parts?: Item;
}

export default ItemRelation;
