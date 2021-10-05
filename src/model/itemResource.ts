import {
  Column,
  Model,
  PrimaryKey,
  Table,
  NotNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { FileStatusEnum, FileStatus, FileStatusType } from "./fileStatus";
import Item from "./item";
import { DataTypes, UUID, UUIDV4 } from "sequelize";

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     ItemFileType:
 *       require: true
 *       type: string
 *       enum:
 *          - img
 *          - thumbnail
 */
export const ItemFileTypes = {
  /**
   * 이미지
   */
  img: "img",
  /**
   * 부속품
   */
  thumbnail: "thumbnail",
} as const;

export type ItemFileType = typeof ItemFileTypes[keyof typeof ItemFileTypes];

export const ItemFileTypeEnum = DataTypes.ENUM({
  values: ["img", "thumbnail"],
});

export interface CreateItemResourceInput {
  key: string;
  type: ItemFileType;
  itemId: string;
}

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     ItemResource:
 *       type: object
 *       properties:
 *         itemId:
 *           description: Item id
 *           required: true
 *           type: string
 *         key:
 *           description: file path on S3
 *           required: true
 *           type: string
 *         type:
 *           $ref: "#/components/parameters/ItemFileType"
 *         createdAt:
 *           $ref: "#/components/schemas/createdAt"
 *         updatedAt:
 *           $ref: "#/components/schemas/updatedAt"
 */
@Table({
  charset: "utf8",
})
export class ItemResource extends Model<ItemResource, CreateItemResourceInput> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
    defaultValue: UUIDV4,
  })
  id!: string;

  @ForeignKey(() => Item)
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
  })
  itemId!: string;

  @NotNull
  @Column({
    type: ItemFileTypeEnum,
    allowNull: false,
  })
  type!: ItemFileType;

  @NotNull
  @Column({
    allowNull: false,
  })
  key!: string;

  @NotNull
  @Column({
    type: FileStatusEnum,
    allowNull: false,
    defaultValue: FileStatus.pendding,
  })
  status!: FileStatusType;

  @BelongsTo(() => Item)
  item?: Item;
}

export default ItemResource;
