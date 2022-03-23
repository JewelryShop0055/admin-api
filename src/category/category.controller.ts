import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

import { CreateCategoryDto, UpdateCategoryDto } from "../dto";
import { Category } from "../entities";
import { ItemType, PaginationResponse } from "../types";
import { CategoryService } from "./category.service";
import { ItemTypes } from "../types/itemType.type";

@ApiTags("category")
@Controller({
  path: "category",
  version: "1",
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(":type")
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: Category,
  })
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  create(
    @Param("type") type: ItemType,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create({ ...createCategoryDto, type });
  }

  @Get(":type")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  @ApiQuery({
    name: "limit",
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: "page",
    example: 1,
    required: false,
  })
  async findAll(
    @Param("type") type: ItemType,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<PaginationResponse<Category>> {
    const currentPage = page > 1 ? page : 1;
    const offset = limit * (currentPage - 1);
    const data = await this.categoryService.findAll(type, {}, offset, limit);
    const totalItemCount = await this.categoryService.count(type);

    return new PaginationResponse<Category>({
      data,
      currentPage,
      totalItemCount,
      limit,
    });
  }

  @Get(":type/existcheck")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  existCheck(@Param("type") type: ItemType, @Query("name") name: string) {
    return this.categoryService.existCheck(type, name);
  }

  @Get(":type/:id")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  findOne(
    @Param("type") type: ItemType,
    @Param(
      "id",
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.categoryService.findOne(+id, type);
  }

  @Put(":type/:id")
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "The record has been successfully updated.",
    type: Category,
  })
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async update(
    @Param("type") type: ItemType,
    @Param(
      "id",
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, type, updateCategoryDto);
  }

  @Delete(":type/:id")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  remove(
    @Param("type") type: ItemType,
    @Param(
      "id",
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.categoryService.remove(+id, type);
  }
}
