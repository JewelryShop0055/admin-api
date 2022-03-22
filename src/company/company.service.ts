import { Injectable } from "@nestjs/common";
import { WhereOptions } from "sequelize";
import { CreateCompanyDto, UpdateCompanyDto } from "../dto";
import { Company, Category } from "../entities";

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

  async count() {
    return await Category.count();
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
    });
  }

  async remove(id: string) {
    return await Company.destroy({
      where: {
        id,
      },
    });
  }
}
