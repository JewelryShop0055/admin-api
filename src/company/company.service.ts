import { Injectable } from "@nestjs/common";
import { WhereOptions, Op } from "sequelize";
import { CreateCompanyDto, UpdateCompanyDto } from "../dto";
import { Company, Category } from "../entities";
import sequelize from "sequelize";

@Injectable()
export class CompanyService {
  async create(createCompanyDto: CreateCompanyDto) {
    return await Company.create(createCompanyDto);
  }

  async findAll(where?: WhereOptions<Company>, offset = 0, limit = 10) {
    return await Company.findAll({
      where,
      limit,
      offset,
    });
  }

  async count(whereOpstion?: WhereOptions<Company>) {
    return await Category.count({
      where: {
        ...whereOpstion,
      },
    });
  }

  async findOne(id: string) {
    return await Company.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return await Company.update(updateCompanyDto, {
      where: {
        id,
      },
      returning: true,
    })[0][1];
  }

  async remove(id: string) {
    return await Company.destroy({
      where: {
        id,
      },
    });
  }

  async search(preWhereOptions: WhereOptions, offset = 0, limit = 10) {
    return await Company.findAll({
      where: preWhereOptions,
      limit,
      offset,
      order: [
        [
          sequelize.fn(
            "ts_rank_cd",
            sequelize.col("tsvector"),
            preWhereOptions["tsvector"][Op.match],
          ),
          "desc",
        ],
      ],
    });
  }

  async autoComplete(preWhereOptions: WhereOptions, limit = 10) {
    return (await this.search(preWhereOptions, 0, limit)).map((v) => v.name);
  }
}
