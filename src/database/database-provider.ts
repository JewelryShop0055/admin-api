import { Provider } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { readFileSync } from "fs";
import entities from "../entities";

function readQueryFile() {
  return readFileSync(join(__dirname, "query.sql"), "utf-8");
}

function readMecabQueryFile() {
  return readFileSync(join(__dirname, "ts_mecab_ko.sql"), "utf-8");
}

export const databaseProvider: Provider = {
  provide: "SEQUELIZE",
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const sequelize = new Sequelize({
      ...configService.get("db").config,
      models: entities,
    });
    if (configService.get("db").allowSync) {
      await sequelize.sync();
      await sequelize.query(readQueryFile());

      if (configService.get("db").initKorDic) {

        await sequelize
          .query(readMecabQueryFile(), {
            raw: true,
          })
          .catch((err) => console.error(err));
      }
    }
    return sequelize;
  },
};
