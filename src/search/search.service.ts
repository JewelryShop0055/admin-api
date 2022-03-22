import { Injectable } from "@nestjs/common";
import { Op, WhereOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class SearchService {
  match(q: string): WhereOptions {
    return {
      tsvector: {
        [Op.match]: Sequelize.fn(
          "to_tsquery",
          "korean",
          q.split(" ").join(" & "),
        ),
      },
    };
  }
}
