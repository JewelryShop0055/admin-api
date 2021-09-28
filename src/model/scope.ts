import { DataTypes } from "sequelize";

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     ScopeType:
 *       description: User allow Permissions Type
 *       type: string
 *       example: "operator"
 *       enum:
 *          - operator
 *          - customer
 */
export const ScopeTypes = {
  operator: "operator",
  customer: "customer",
} as const;

export type ScopeType = typeof ScopeTypes[keyof typeof ScopeTypes];

export const ScopeEnum = DataTypes.ENUM({
  values: ["operator", "customer"],
});
