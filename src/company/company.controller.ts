import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto, UpdateCompanyDto } from "../dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { PaginationResponse } from "../types/paginationResponse.type";
import { Company } from "../entities";

@Controller({
  path: "company",
  version: "1",
})
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards()
  @ApiBearerAuth()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @UseGuards()
  @ApiBearerAuth()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
  ): Promise<PaginationResponse<Company>> {
    const offset = limit * (page > 1 ? page - 1 : 0);
    const data = await this.companyService.findAll({}, +offset, +limit);
    const totalItemCount = await this.companyService.count();

    return new PaginationResponse<Company>({
      data,
      currentPage: page,
      totalItemCount,
      limit,
    });
  }

  @Get(":id")
  @UseGuards()
  @ApiBearerAuth()
  async findOne(@Param("id") id: string) {
    return this.companyService.findOne(id);
  }

  @Put(":id")
  @UseGuards()
  @ApiBearerAuth()
  async update(
    @Param("id") id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(":id")
  @UseGuards()
  @ApiBearerAuth()
  remove(@Param("id") id: string) {
    return this.companyService.remove(id);
  }
}
