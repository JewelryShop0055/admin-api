import { Controller, Get, Param, Query } from "@nestjs/common";
import { ItemService } from "../item/item.service";
import { CategoryService } from "../category/category.service";
import { CompanyService } from "../company/company.service";
import { ItemType } from "../types/itemType.type";
import { SearchService } from "./search.service";
import { PaginationResponse } from "../types/paginationResponse.type";
import Item from "../entities/item.entity";
import Category from "../entities/category.entity";
import Company from "../entities/company.entity";

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
  async itemSearch(
    @Param("type") type: ItemType | "all",
    @Query("q") q: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
  ) {
    const offset = limit * (page > 1 ? page - 1 : 0);
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
      currentPage: page,
      totalItemCount,
      limit,
    });
  }

  @Get("category/:type")
  async categorySearch(
    @Param("type") type: ItemType | "all",
    @Query("q") q: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
  ) {
    const offset = limit * (page > 1 ? page - 1 : 0);
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
      currentPage: page,
      totalItemCount,
      limit,
    });
  }

  @Get("company")
  async companySearch(
    @Query("q") q: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
  ) {
    const offset = limit * (page > 1 ? page - 1 : 0);
    const matchOption = this.searchService.match(q);
    const data = await this.companyService.search(matchOption, offset, limit);

    const totalItemCount = await this.companyService.count(matchOption);

    return new PaginationResponse<Company>({
      data,
      currentPage: page,
      totalItemCount,
      limit,
    });
  }

  @Get("item/:type/autocomplete")
  async itemAutoComplete(
    @Param("type") type: ItemType | "all",
    @Query("q") q: string,
    @Query("limit") limit = 10,
  ) {
    const matchOption = this.searchService.match(q);
    return this.itemService.autoComplete(type, matchOption, limit);
  }

  @Get("category/:type/autocomplete")
  async categoryAutocomplete(
    @Param("type") type: ItemType | "all",
    @Query("q") q: string,
    @Query("limit") limit = 10,
  ) {
    const matchOption = this.searchService.match(q);
    return this.categoryService.autoComplete(type, matchOption, limit);
  }

  @Get("company/autocomplete")
  async companyAutoComplete(@Query("q") q: string, @Query("limit") limit = 10) {
    const matchOption = this.searchService.match(q);
    return this.companyService.autoComplete(matchOption, limit);
  }
}
