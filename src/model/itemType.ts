import { DataTypes } from "sequelize";

export const ItemTypes = {
  product: "product",
  parts: "parts",
} as const;

export type ItemType = typeof ItemTypes[keyof typeof ItemTypes];

export const ItemTypeEnum = DataTypes.ENUM({
  values: ["product", "parts"],
});

/**
 * 아이템 단위
 */
export const ItemUnitTypes = {
  /**
   * 갯 수
   */
  ea: "ea",
  /**
   * 그람
   */
  g: "g",
  /**
   * 킬로그람
   */
  kg: "kg",
  /**
   * 캐럿
   */
  carat: "carat",
  /**
   * 돈
   */
  mace: "mace",
} as const;

export type ItemUnitType = typeof ItemUnitTypes[keyof typeof ItemUnitTypes];

export const ItemUnitTypeEnum = DataTypes.ENUM({
  values: ["ea", "g", "kg", "carat"],
});
