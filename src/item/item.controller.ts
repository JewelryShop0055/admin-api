import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

import { CreateItemDto, CreateItemRelationDto, UpdateItemDto } from "../dto";
import { Item } from "../entities";
import { ItemType, ItemTypes, PaginationResponse } from "../types";
import { ItemService } from "./item.service";

@ApiTags("item")
@Controller({
  path: "item",
  version: "1",
})
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post(":type")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async create(
    @Param("type") type: ItemType,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.itemService.create({ ...createItemDto, type });
  }

  @Get(":type")
  @ApiBearerAuth()
  @ApiQuery({
    name: "partNo",
    required: false,
  })
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async findAll(
    @Param("type")
    type: ItemType,
    @Query("partNo")
    partNo?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe)
    page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const currentPage = page > 1 ? page : 1;
    const offset = limit * (currentPage - 1);
    const data = await this.itemService.findAll(
      type,
      partNo ? { partNo } : undefined,
      offset,
      limit,
    );
    const totalItemCount = await this.itemService.count(type);

    return new PaginationResponse<Item>({
      data,
      currentPage,
      totalItemCount,
      limit,
    });
  }

  @Get(":type/:id")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async findOne(
    @Param("type") type: ItemType,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.itemService.findOne(id, type);
  }

  @Put(":type/:id")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async update(
    @Param("type") type: ItemType,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(id, type, updateItemDto);
  }

  @Delete(":type/:id")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async remove(
    @Param("type") type: ItemType,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.itemService.remove(id, type);
  }

  @Get(":type/:id/category")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async getGategories(
    @Param("type") type: ItemType,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const offset = limit * (page > 1 ? page - 1 : 0);
    return await this.itemService.getCategories(id, type, offset, +limit);
  }

  @Put(":type/:id/category")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async updateCategory(
    @Param("type") type: ItemType,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body("categoryId", ParseIntPipe) categoryId: number,
  ) {
    return this.itemService.updateCategory(id, type, +categoryId);
  }

  @Delete(":type/:id/category/:categoryId")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async removeCategory(
    @Param("type") type: ItemType,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Param(
      "categoryId",
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    categoryId: number,
  ) {
    return this.itemService.removeCategory(id, type, +categoryId);
  }

  @Get("product/:id/parts")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async getParts(
    @Param("type") type: ItemType,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return await this.itemService.getParts(id);
  }

  @Put("product/:id/parts")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async addParts(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() createItemRelationDto: CreateItemRelationDto,
  ) {
    return this.itemService.addParts({
      ...createItemRelationDto,
      productId: id,
    });
  }

  @Delete("product/:id/parts/:partsId")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async removeParts(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Param("partsId", new ParseUUIDPipe()) partsId: string,
  ) {
    return this.itemService.removeParts(id, partsId);
  }

  @Get(":type/:id/company")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async getCompany(
    @Param("type") type: ItemType,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const offset = limit * (page > 1 ? page - 1 : 0);
    return await this.itemService.getCompanies(id, type, offset, +limit);
  }

  @Put(":type/:id/company")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async addCompany(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Param("type") type: ItemType,
    @Body("companyId", new ParseUUIDPipe()) companyId: string,
  ) {
    return this.itemService.addCompany(id, type, companyId);
  }

  @Delete(":type/:id/company/:companyId")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemType",
    enum: Object.keys(ItemTypes).map((v) => ItemTypes[v]),
  })
  async removeCompany(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Param("type") type: ItemType,
    @Param("companyId", new ParseUUIDPipe()) companyId: string,
  ) {
    return this.itemService.removeCompany(id, type, companyId);
  }
}
