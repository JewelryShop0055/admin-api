import { DataTypes } from "sequelize";

export const CompanyTypes = {
  /**
   * 공방
   */
  craftshop: "craftshop",

  company: "company",
  retail: "retail",
} as const;

export type CompanyType = typeof CompanyTypes[keyof typeof CompanyTypes];

export const CompanyTypeEnum = DataTypes.ENUM({
  values: ["craftshop", "company", "retail"],
});
