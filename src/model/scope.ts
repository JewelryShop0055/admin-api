import { DataTypes } from "sequelize";

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     ScopeType:
 *       description: >
 *         User allow Permissions Type:
 *          * operator: 관리자 권한
 *          * customer: 소비자 권한
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
