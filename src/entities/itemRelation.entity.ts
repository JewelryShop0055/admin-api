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
import { ItemTypes } from "../types";
import { CreateItemRelationDto } from "../dto";
import Item from "./item.entity";

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
export class ItemRelation extends Model<ItemRelation, CreateItemRelationDto> {
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
