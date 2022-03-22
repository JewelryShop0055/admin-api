import { Provider } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { readFileSync } from "fs";
import entities from "../entities";

function readQueryFile() {
  return readFileSync(join(__dirname, "query.sql"), "utf-8");
}

export const databaseProvider: Provider = {
  provide: "SEQUELIZE",
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    // const sequelize = new Sequelize({
    //   ...configService.get("db").config,
    //   models: entities,
    // });
    // if (configService.get("db").allowSync) {
    //   await sequelize.sync();
    //   sequelize.query(readQueryFile());
    // }
    // return sequelize;
  },
};
