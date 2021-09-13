import { DataTypes } from "sequelize";
export const ScopeTypes = {
  operator: "operator",
  customer: "customer",
} as const;

export type ScopeType = typeof ScopeTypes[keyof typeof ScopeTypes];

export const ScopeEnum = DataTypes.ENUM({
  values: ["operator", "customer"],
});
