import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  DefaultValuePipe,
  NotFoundException,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto, UpdateCompanyDto } from "../dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationResponse } from "../types/paginationResponse.type";
import { Company } from "../entities";
import { ParseIntPipe } from "@nestjs/common";

@ApiTags("company")
@Controller({
  path: "company",
  version: "1",
})
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiBearerAuth()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiBearerAuth()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<PaginationResponse<Company>> {
    const currentPage = page > 1 ? page : 1;
    const offset = limit * (currentPage - 1);
    const data = await this.companyService.findAll({}, offset, limit);
    const totalItemCount = await this.companyService.count();

    return new PaginationResponse<Company>({
      data,
      currentPage,
      totalItemCount,
      limit,
    });
  }

  @Get(":id")
  @ApiBearerAuth()
  async findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.companyService.findOne(id);
  }

  @Put(":id")
  @ApiBearerAuth()
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const result = await this.companyService.update(id, updateCompanyDto);

    if (!result) {
      throw new NotFoundException();
    }
  }

  @Delete(":id")
  @ApiBearerAuth()
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    if (!this.companyService.remove(id)) {
      throw new NotFoundException();
    }
  }
}
