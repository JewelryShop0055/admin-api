import { Model, ModelCtor, SequelizeOptions } from "sequelize-typescript";
import configure from "./sequelize.json";

export function getSequelizeConfigure(
  models: ModelCtor<Model<any, any>>[],
): SequelizeOptions {
  return {
    models,
    ...(configure as SequelizeOptions),
  };
}
