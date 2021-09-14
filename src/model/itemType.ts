import { DataTypes } from "sequelize";

export const ItemTypes = {
  product: "product",
  parts: "parts",
} as const;

export type ItemType = typeof ItemTypes[keyof typeof ItemTypes];

export const ItemTypeEnum = DataTypes.ENUM({
  values: ["product", "parts"],
});

export const ItemUnitTypes = {
  ea: "ea",
  g: "g",
  kg: "kg",
};

export type ItemUnitType = typeof ItemUnitTypes[keyof typeof ItemUnitTypes];

export const ItemUnitTypeEnum = DataTypes.ENUM({
  values: ["ea", "g", "kg"],
});
