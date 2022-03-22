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
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto";
import { ItemType, PaginationResponse } from "../types";
import { Category } from "../entities";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

@Controller({
  path: "category",
  version: "1",
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(":type")
  @UseGuards()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: Category,
  })
  create(
    @Param("type") type: ItemType,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create({ ...createCategoryDto, type });
  }

  @Get(":type")
  @UseGuards()
  @ApiBearerAuth()
  async findAll(
    @Param("type") type: ItemType,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
  ): Promise<PaginationResponse<Category>> {
    const offset = limit * (page > 1 ? page - 1 : 0);
    const data = await this.categoryService.findAll(type, {}, +offset, +limit);
    const totalItemCount = await this.categoryService.count(type);

    return new PaginationResponse<Category>({
      data,
      currentPage: page,
      totalItemCount,
      limit,
    });
  }

  @Get(":type/existcheck")
  @UseGuards()
  @ApiBearerAuth()
  existCheck(@Param("type") type: ItemType, @Query("name") name: string) {
    return this.categoryService.existCheck(type, name);
  }

  @Get(":type/:id")
  @UseGuards()
  @ApiBearerAuth()
  findOne(@Param("type") type: ItemType, @Param("id") id: string) {
    return this.categoryService.findOne(+id, type);
  }

  @Put(":type/:id")
  @UseGuards()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "The record has been successfully updated.",
    type: Category,
  })
  update(
    @Param("type") type: ItemType,
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, type, updateCategoryDto);
  }

  @Delete(":type/:id")
  @UseGuards()
  @ApiBearerAuth()
  remove(@Param("type") type: ItemType, @Param("id") id: string) {
    return this.categoryService.remove(+id, type);
  }
}
