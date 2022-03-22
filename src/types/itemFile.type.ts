import { DataTypes } from "sequelize";

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
