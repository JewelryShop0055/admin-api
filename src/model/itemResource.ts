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
import { jsonIgnore } from "json-ignore";
import { config } from "../../configures/config";

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
 *         path:
 *           description: resource url path
 *           required: true
 *           type: object
 *           properties:
 *             raw:
 *               description: original file path. (do not use this image.)
 *               type: string
 *               required: ture
 *               example: https://resource.example.com/img/item/product/406c46f1-cd0b-4e63-817d-ad783b52d62e/eb5c4557-c200-4a56-9fd2-48f6900dc7fc.jpg
 *             original:
 *               description: original size webp image file path.
 *               type: string
 *               required: false
 *               example: https://resource.example.com/resized/img/item/product/406c46f1-cd0b-4e63-817d-ad783b52d62e/eb5c4557-c200-4a56-9fd2-48f6900dc7fc.webp
 *             "100":
 *               description: 100x100 size webp image file path.
 *               type: string
 *               required: false
 *               example: https://resource.example.com/resized/img/item/product/406c46f1-cd0b-4e63-817d-ad783b52d62e/eb5c4557-c200-4a56-9fd2-48f6900dc7fc_100x100.webp
 *             "500":
 *               description: 500x500 size webp image file path.
 *               type: string
 *               required: false
 *               example: https://resource.example.com/resized/img/item/product/406c46f1-cd0b-4e63-817d-ad783b52d62e/eb5c4557-c200-4a56-9fd2-48f6900dc7fc_500x500.webp
 *             "1000":
 *               description: 1000x1000 size webp image file path.
 *               type: string
 *               required: false
 *               example: https://resource.example.com/resized/img/item/product/406c46f1-cd0b-4e63-817d-ad783b52d62e/eb5c4557-c200-4a56-9fd2-48f6900dc7fc_1000x1000.webp
 *         type:
 *           $ref: "#/components/schemas/ItemFileType"
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

  @jsonIgnore()
  @NotNull
  @Column({
    allowNull: false,
  })
  key!: string;

  get path() {
    const ext = this.key.split(".")[1];
    if (
      this.type === ItemFileTypes.img ||
      this.type === ItemFileTypes.thumbnail
    ) {
      return {
        raw: this.key,
        original: `${config.app.resource.address}/resized/${this.key.replace(
          ext,
          ".webp",
        )}`,
        100: `${config.app.resource.address}/resized/${this.key.replace(
          ext,
          "_100x100.webp",
        )}`,
        500: `${config.app.resource.address}/resized/${this.key.replace(
          ext,
          "_500x500.webp",
        )}`,
        1000: `${config.app.resource.address}/resized/${this.key.replace(
          ext,
          "_1000x1000.webp",
        )}`,
      };
    } else {
      return {
        raw: this.key,
      };
    }
  }

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
