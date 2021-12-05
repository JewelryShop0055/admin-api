import { FindOptions } from "sequelize";
import { Model } from "sequelize-typescript";

import { PaginationResponse } from ".";

export interface SearchOption<T extends Model> {
  keywords: string[];
  findOptions: FindOptions<T>;
  limit: number;
  page: number;
}

export type SearchMethod<T extends Model> = (
  options: SearchOption<T>,
) => Promise<PaginationResponse<T>>;
