import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";

import { CategoryService } from "../category/category.service";
import { CompanyService } from "../company/company.service";
import Category from "../entities/category.entity";
import Company from "../entities/company.entity";
import Item from "../entities/item.entity";
import { ItemService } from "../item/item.service";
import { ItemType, ItemTypes } from "../types/itemType.type";
import { PaginationResponse } from "../types/paginationResponse.type";
import { SearchService } from "./search.service";

@ApiTags("search")
@Controller({
  path: "search",
  version: "1",
})
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly itemService: ItemService,
    private readonly categoryService: CategoryService,
    private readonly companyService: CompanyService,
  ) {}

  @Get("item/:type")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemTypeAndAll",
    enum: Object.keys(ItemTypes)
      .map((v) => ItemTypes[v])
      .concat(["all"]),
  })
  async itemSearch(
    @Param("type") type: ItemType | "all",
    @Query("q") q: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const currentPage = page > 1 ? page : 1;
    const offset = limit * (currentPage - 1);
    const matchOption = this.searchService.match(q);
    const data = await this.itemService.search(
      type,
      matchOption,
      offset,
      limit,
    );

    const totalItemCount = await this.itemService.count(type, matchOption);

    return new PaginationResponse<Item>({
      data,
      currentPage,
      totalItemCount,
      limit,
    });
  }

  @Get("category/:type")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enumName: "ItemTypeAndAll",
    enum: Object.keys(ItemTypes)
      .map((v) => ItemTypes[v])
      .concat(["all"]),
  })
  async categorySearch(
    @Param("type") type: ItemType | "all",
    @Query("q") q: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const currentPage = page > 1 ? page : 1;
    const offset = limit * (currentPage - 1);
    const matchOption = this.searchService.match(q);
    const data = await this.categoryService.search(
      type,
      matchOption,
      offset,
      limit,
    );

    const totalItemCount = await this.categoryService.count(type, matchOption);

    return new PaginationResponse<Category>({
      data,
      currentPage,
      totalItemCount,
      limit,
    });
  }

  @Get("company")
  @ApiBearerAuth()
  async companySearch(
    @Query("q") q: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const currentPage = page > 1 ? page : 1;
    const offset = limit * (currentPage - 1);
    const matchOption = this.searchService.match(q);
    const data = await this.companyService.search(matchOption, offset, limit);

    const totalItemCount = await this.companyService.count(matchOption);

    return new PaginationResponse<Company>({
      data,
      currentPage,
      totalItemCount,
      limit,
    });
  }

  @Get("item/:type/autocomplete")
  @ApiBearerAuth()
  async itemAutoComplete(
    @Param("type") type: ItemType | "all",
    @Query("q") q: string,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const matchOption = this.searchService.match(q);
    return this.itemService.autoComplete(type, matchOption, limit);
  }

  @Get("category/:type/autocomplete")
  @ApiBearerAuth()
  async categoryAutocomplete(
    @Param("type") type: ItemType | "all",
    @Query("q") q: string,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const matchOption = this.searchService.match(q);
    return this.categoryService.autoComplete(type, matchOption, limit);
  }

  @Get("company/autocomplete")
  async companyAutoComplete(
    @Query("q") q: string,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const matchOption = this.searchService.match(q);
    return this.companyService.autoComplete(matchOption, limit);
  }
}
