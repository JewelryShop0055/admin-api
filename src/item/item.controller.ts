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
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import { CreateItemDto, CreateItemRelationDto, UpdateItemDto } from "../dto";
import { Item } from "../entities";
import { ItemType, ItemTypes, PaginationResponse } from "../types";
import { ItemService } from "./item.service";
import { File } from "fastify-multer/lib/interfaces";
import { S3Service } from "../aws/s3/s3.service";
import { Roles } from "nest-keycloak-connect";
import { FileFieldsInterceptor } from "../multer/interceptors/file-fields.interceptor";
import { UuidGenerationInterceptor } from "./interceptors/uuidGeneration.Interceptor";
import { ItemFileType } from "../types/itemFile.type";
import { FileErrorFilter } from "./filters/fileError.filter";

@Roles({ roles: ["realm:READ_ITEM"] })
@ApiTags("item")
@Controller({
  path: "item",
  version: "1",
})
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly s3Service: S3Service,
  ) {}

  @Roles({ roles: ["realm:WRITE_ITEM"] })
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

  @Roles({ roles: ["realm:WRITE_ITEM"] })
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
    const result = await this.itemService.update(id, type, updateItemDto);
    if (!result) {
      throw new NotFoundException();
    }
  }

  @Roles({ roles: ["realm:REMOVE_ITEM"] })
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
    if (!this.itemService.remove(id, type)) {
      throw new NotFoundException();
    }
  }

  @Roles({ roles: ["realm:READ_CATEOGRY"] })
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

  @Roles({ roles: ["realm:WRITE_ITEM"] })
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

  @Roles({ roles: ["realm:WRITE_ITEM"] })
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
    if (this.itemService.removeCategory(id, type, +categoryId)) {
      throw new NotFoundException();
    }
  }

  @Roles({ roles: ["realm:READ_COMPANY"] })
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

  @Roles({ roles: ["realm:WRITE_ITEM"] })
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

  @Roles({ roles: ["realm:WRITE_ITEM"] })
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
    if (this.itemService.removeCompany(id, type, companyId)) {
      throw new NotFoundException();
    }
  }

  @Roles({ roles: ["realm:READ_ITEM"] })
  @Get(":type/:id/resource")
  async getResource(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Param("type") type: ItemType,
    @Query("fileType") fileType: ItemFileType,
    @Query("order") order?: number,
  ) {
    const results = await this.itemService.getResource(
      id,
      type,
      fileType,
      order,
    );

    return results.map((result) => {
      return {
        id: result.id,
        itemId: result.itemId,
        type: result.type,
        paths: result.paths,
        order: result.order,
      };
    });
  }

  @Roles({ roles: ["realm:WRITE_ITEM"] })
  @Post(":type/:id/resource/:fileType")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    UuidGenerationInterceptor(),
    FileFieldsInterceptor([
      {
        name: "origin",
        maxCount: 1,
      },
      {
        name: "1000x1000",
        maxCount: 1,
      },
      {
        name: "500x500",
        maxCount: 1,
      },
      {
        name: "100x100",
        maxCount: 1,
      },
    ]),
  )
  @UseFilters(FileErrorFilter)
  async uploadFile(
    @Query("rav_uuid_gen") resourceId: string,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Param("type") type: ItemType,
    @Param("fileType") fileType: ItemFileType,
    @UploadedFiles() files: (File | any)[],
    @Body("order") order?: number,
  ) {
    const result = await this.itemService.addResource(
      id,
      type,
      resourceId,
      fileType,
      Object.keys(files).reduce((p, v) => {
        p[v] = files[v]?.[0]?.key;
        return p;
      }, {}),
      order,
    );

    return {
      id: result.id,
      itemId: result.itemId,
      type: result.type,
      paths: result.paths,
      order: result.order,
    };
  }

  @Roles({ roles: ["realm:WRITE_ITEM"] })
  @Delete(":type/:id/resource/:resourceId")
  async removeResource(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Param("type") type: ItemType,
    @Param("resourceId", new ParseUUIDPipe()) resourceId: string,
  ) {
    await this.itemService.removeResource(id, type, resourceId);
  }

  @Get(":type/:id/parts")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enum: ["product"],
  })
  async getParts(
    @Param("type") type: "product",
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return await this.itemService.getParts(id);
  }

  @Roles({ roles: ["realm:WRITE_ITEM"] })
  @Put(":type/:id/parts")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enum: ["product"],
  })
  async addParts(
    @Param("type") type: "product",
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() createItemRelationDto: CreateItemRelationDto,
  ) {
    return this.itemService.addParts({
      ...createItemRelationDto,
      productId: id,
    });
  }

  @Roles({ roles: ["realm:WRITE_ITEM"] })
  @Delete(":type/:id/parts/:partsId")
  @ApiBearerAuth()
  @ApiParam({
    name: "type",
    enum: ["product"],
  })
  async removeParts(
    @Param("type") type: "product",
    @Param("id", new ParseUUIDPipe()) id: string,
    @Param("partsId", new ParseUUIDPipe()) partsId: string,
  ) {
    return this.itemService.removeParts(id, partsId);
  }
}
