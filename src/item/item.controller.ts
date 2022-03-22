import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { CreateItemDto, CreateItemRelationDto, UpdateItemDto } from "../dto";
import { ItemType, PaginationResponse } from "../types";
import { ItemService } from "./item.service";
import { Item } from "../entities";

@Controller({
  path: "item",
  version: "1",
})
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post(":type")
  @UseGuards()
  @ApiBearerAuth()
  async create(
    @Param("type") type: ItemType,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.itemService.create({ ...createItemDto, type });
  }

  @Get(":type")
  @UseGuards()
  @ApiBearerAuth()
  async findAll(
    @Param("type") type: ItemType,
    @Query("partNo") partNo?: string,
    @Query("page")
    page = 1,
    @Query("limit") limit = 10,
  ) {
    const offset = limit * (page > 1 ? page - 1 : 0);
    const data = await this.itemService.findAll(
      type,
      { partNo },
      offset,
      limit,
    );
    const totalItemCount = await this.itemService.count(type);

    return new PaginationResponse<Item>({
      data,
      currentPage: page,
      totalItemCount,
      limit,
    });
  }

  @Get(":type/:id")
  @UseGuards()
  @ApiBearerAuth()
  async findOne(@Param("type") type: ItemType, @Param("id") id: string) {
    return this.itemService.findOne(id, type);
  }

  @Put(":type/:id")
  @UseGuards()
  @ApiBearerAuth()
  async update(
    @Param("type") type: ItemType,
    @Param("id") id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(id, type, updateItemDto);
  }

  @Delete(":type/:id")
  @UseGuards()
  @ApiBearerAuth()
  async remove(@Param("type") type: ItemType, @Param("id") id: string) {
    return this.itemService.remove(id, type);
  }

  @Get(":type/:id/category")
  @UseGuards()
  @ApiBearerAuth()
  async getGategories(
    @Param("type") type: ItemType,
    @Param("id") id: string,
    @Query("offset") offset = 0,
    @Query("limit") limit = 10,
  ) {
    return await this.itemService.getCategories(id, type, +offset, +limit);
  }

  @Put(":type/:id/category")
  @UseGuards()
  @ApiBearerAuth()
  async updateCategory(
    @Param("type") type: ItemType,
    @Param("id") id: string,
    @Body("categoryId") categoryId: number,
  ) {
    return this.itemService.updateCategory(id, type, +categoryId);
  }

  @Delete(":type/:id/category/:categoryId")
  @UseGuards()
  @ApiBearerAuth()
  async removeCategory(
    @Param("type") type: ItemType,
    @Param("id") id: string,
    @Param("categoryId") categoryId: number,
  ) {
    return this.itemService.removeCategory(id, type, +categoryId);
  }

  @Get("product/:id/parts")
  @UseGuards()
  @ApiBearerAuth()
  async getParts(@Param("type") type: ItemType, @Param("id") id: string) {
    return await this.itemService.getParts(id);
  }

  @Put("product/:id/parts")
  @UseGuards()
  @ApiBearerAuth()
  async addParts(
    @Param("id") id: string,
    @Body() createItemRelationDto: CreateItemRelationDto,
  ) {
    return this.itemService.addParts({
      ...createItemRelationDto,
      productId: id,
    });
  }

  @Delete("product/:id/parts/:partsId")
  @UseGuards()
  @ApiBearerAuth()
  async removeParts(
    @Param("id") id: string,
    @Param("partsId") partsId: string,
  ) {
    return this.itemService.removeParts(id, partsId);
  }

  ////admin/item/{itemType}/{id}/

  @Get(":type/:id/company")
  @UseGuards()
  @ApiBearerAuth()
  async getCompany(
    @Param("type") type: ItemType,
    @Param("id") id: string,
    @Query("offset") offset = 0,
    @Query("limit") limit = 10,
  ) {
    return await this.itemService.getCompanies(id, type, +offset, +limit);
  }

  @Put(":type/:id/company")
  @UseGuards()
  @ApiBearerAuth()
  async addCompany(
    @Param("id") id: string,
    @Param("type") type: ItemType,
    @Body("companyId") companyId: string,
  ) {
    return this.itemService.addCompany(id, type, companyId);
  }

  @Delete(":type/:id/company/:companyId")
  @UseGuards()
  @ApiBearerAuth()
  async removeCompany(
    @Param("id") id: string,
    @Param("type") type: ItemType,
    @Param("companyId") companyId: string,
  ) {
    return this.itemService.removeCompany(id, type, companyId);
  }
}
