import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Op, WhereOptions, Sequelize } from "sequelize";

import { CategoryService } from "../category/category.service";
import { CompanyService } from "../company/company.service";
import { CreateItemDto, CreateItemRelationDto, UpdateItemDto } from "../dto";
import {
  Item,
  ItemCategoryRelation,
  ItemCompanyRelation,
  ItemRelation,
  ItemResource,
} from "../entities";
import { ItemType, ItemTypes, ResourcePath } from "../types";
import sequelize from "sequelize";
import { ItemFileType } from "../types/itemFile.type";
import { S3Service } from "../aws/s3/s3.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ItemService {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    // @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,

    private readonly s3Service: S3Service,

    @Inject("SEQUELIZE")
    private readonly sequelizeInstance: Sequelize,

    private readonly configService: ConfigService,
  ) {}

  async create(createItemDto: CreateItemDto) {
    return await Item.create(createItemDto);
  }

  async findAll(
    type: ItemType,
    where?: WhereOptions<Item>,
    offset = 0,
    limit = 10,
  ) {
    return Item.findAll({
      where: {
        ...where,
        type,
      },
      offset,
      limit,
    });
  }

  async count(type: ItemType | "all", whereOpstion: WhereOptions<Item> = {}) {
    if (type !== "all") {
      whereOpstion["type"] = type;
    }

    return await Item.count({
      where: {
        ...whereOpstion,
      },
    });
  }

  async findOne(id: string, type: ItemType) {
    return await Item.findOne({
      where: {
        id,
        type,
      },
    });
  }

  async update(id: string, type: ItemType, updateItemDto: UpdateItemDto) {
    return (
      await Item.update(updateItemDto, {
        where: {
          id,
          type,
        },
        returning: true,
      })
    )[1][0];
  }

  async remove(id: string, type: ItemType) {
    return await Item.destroy({
      where: {
        id,
        type,
      },
    });
  }

  async getCategories(id: string, type: ItemType, offset = 0, limit = 10) {
    const list = await ItemCategoryRelation.findAll({
      attributes: ["categoryId"],
      where: {
        itemId: id,
      },
      offset,
      limit,
    });

    return await this.categoryService.findAll(type, {
      id: {
        [Op.in]: list.map((v) => v.categoryId),
      },
    });
  }

  async getCategoryCount(id: string, type: ItemType) {
    return await ItemCategoryRelation.count({
      include: [
        {
          model: Item,
          as: "product",
          where: {
            type,
            id,
          },
        },
      ],
    });
  }

  async updateCategory(id: string, type: ItemType, categoryId: number) {
    const item = await this.findOne(id, type);
    const category = await this.categoryService.findOne(categoryId, type);

    if (!item) {
      throw new NotFoundException("Not Exist Item");
    }

    if (!category) {
      throw new NotFoundException("Not Exist Category");
    }

    const relation = await ItemCategoryRelation.findOne({
      where: {
        itemId: id,
      },
    });

    if (relation) {
      relation.category = category;
      await relation.save();
    } else {
      await ItemCategoryRelation.create({
        item,
        category,
      });
    }
  }

  async removeCategory(id: string, type: ItemType, categoryId: number) {
    return await ItemCategoryRelation.destroy({
      where: {
        itemId: id,
        categoryId,
      },
    });
  }

  async getParts(productId: string) {
    return await Item.findAll({
      include: [
        {
          model: ItemRelation,
          where: {
            productId,
          },
          as: "productRelation",
        },
      ],
    });
  }

  async addParts(createItemRelationDto: CreateItemRelationDto) {
    const product = this.findOne(
      createItemRelationDto.productId,
      ItemTypes.product,
    );
    const parts = this.findOne(createItemRelationDto.partsId, ItemTypes.parts);

    if (!product) {
      throw new NotFoundException("Not Exist Product");
    }

    if (!parts) {
      throw new NotFoundException("Not Exist Parts");
    }

    const relation = await ItemRelation.findOne({
      where: {
        partsId: createItemRelationDto.partsId,
        productId: createItemRelationDto.productId,
      },
    });

    if (relation) {
      throw new BadRequestException("Already Added");
    }

    return await ItemRelation.create(createItemRelationDto);
  }

  async removeParts(productId: string, partsId: string) {
    return await ItemRelation.destroy({
      where: {
        productId,
        partsId,
      },
    });
  }

  //
  async getCompanies(id: string, type: ItemType, offset = 0, limit = 10) {
    const list = await ItemCompanyRelation.findAll({
      attributes: ["companyId"],
      where: {
        itemId: id,
      },
      offset,
      limit,
    });

    return await this.companyService.findAll({
      id: {
        [Op.in]: list.map((v) => v.companyId),
      },
    });
  }

  async getCompanyCount(id: string, type: ItemType) {
    return await ItemCompanyRelation.count({
      include: [
        {
          model: Item,
          as: "product",
          where: {
            type,
            id,
          },
        },
      ],
    });
  }

  async addCompany(id: string, type: ItemType, companyId: string) {
    const item = await this.findOne(id, type);
    const company = await this.companyService.findOne(companyId);

    if (!item) {
      throw new NotFoundException("Not Exist Item");
    }

    if (!company) {
      throw new NotFoundException("Not Exist Company");
    }

    return await ItemCompanyRelation.create({
      item,
      company,
    });
  }

  async removeCompany(id: string, type: ItemType, companyId: string) {
    return await ItemCompanyRelation.destroy({
      where: {
        itemId: id,
        companyId,
      },
    });
  }

  async search(
    type: ItemType | "all",
    preWhereOptions: WhereOptions,
    offset = 0,
    limit = 10,
  ) {
    if (type !== "all") {
      preWhereOptions["type"] = type;
    }

    return await Item.findAll({
      where: preWhereOptions,
      limit,
      offset,
      order: [
        [
          sequelize.fn(
            "ts_rank_cd",
            sequelize.col("tsvector"),
            preWhereOptions["tsvector"][Op.match],
          ),
          "desc",
        ],
      ],
    });
  }

  async autoComplete(
    type: ItemType | "all",
    preWhereOptions: WhereOptions,
    limit = 10,
  ) {
    return (await this.search(type, preWhereOptions, 0, limit)).map(
      (v) => v.name,
    );
  }

  async getResourceCount(id: string, fileType?: ItemFileType) {
    const where = {
      itemId: id,
    };

    if (fileType) {
      where["type"] = fileType;
    }

    return await ItemResource.count({
      where,
    });
  }

  async getResource(
    id: string,
    type: string,
    fileType?: string,
    order?: number,
  ) {
    const where = {
      type: fileType,
    };

    if (order) {
      where["order"] = order;
    }

    const results = await ItemResource.findAll({
      where,
      include: [
        {
          model: Item,
          where: {
            id,
            type,
          },
        },
      ],
    });

    return results.map((v) => {
      return {
        ...v.toJSON(),
        paths: Object.keys(v.paths).reduce((p, k) => {
          p[k] = `${this.configService.get("app").resourceAddress}/${
            v.paths[k]
          }`;
          return p;
        }, {}),
      };
    });
  }

  async addResource(
    id: string,
    type: ItemType,
    resourceId: string,
    fileType: ItemFileType,
    paths: ResourcePath,
    order?: number,
  ) {
    const item = await Item.findOne({
      where: {
        id,
        type,
      },
    });

    if (!item) {
      throw new NotFoundException(`Not Exist ${type}:${id}`);
    }

    const currentCount = await this.getResourceCount(id, fileType);
    order = order ? order : currentCount;

    if (fileType === "thumbnail" && currentCount >= 5) {
      throw new BadRequestException("Thumail is not over 5 images");
    }

    const transaction = await this.sequelizeInstance.transaction();

    try {
      await ItemResource.update(
        {
          order: Sequelize.fn("order + 1"),
        },
        {
          where: {
            type: fileType,
            itemId: id,
            order: {
              [Op.gte]: order,
            },
          },
          transaction,
        },
      );

      const result = await ItemResource.create(
        {
          id: resourceId,
          type: fileType,
          item,
          paths,
          order,
        },
        {
          transaction,
        },
      );

      return {
        ...result.toJSON(),
        paths: Object.keys(result.paths).reduce((p, k) => {
          p[k] = `${this.configService.get("app").resourceAddress}/${
            result.paths[k]
          }`;
          return p;
        }, {}),
      };
    } catch (e) {
      await transaction.rollback().catch((err) => Logger.error(err));
      throw new InternalServerErrorException();
    }
  }

  async removeResource(id: string, type: ItemType, resourceId: string) {
    const resource = await ItemResource.findOne({
      where: {
        id: resourceId,
      },
      include: [
        {
          model: Item,
          where: {
            id,
            type,
          },
        },
      ],
    });

    if (!resource) {
      throw new NotFoundException(`Not Fount Resource ${resourceId} of ${id}`);
    }

    const transaction = await this.sequelizeInstance.transaction();

    try {
      await resource.destroy({ transaction });

      await ItemResource.update(
        {
          order: Sequelize.fn("order - 1"),
        },
        {
          where: {
            type: resource.type,
            itemId: id,
            order: {
              [Op.gte]: resource.order,
            },
          },
          transaction,
        },
      );

      await Promise.all(
        Object.keys(resource.paths).map(
          async (r) => await this.s3Service.delete(resource.paths[r]),
        ),
      );
    } catch (e) {
      console.error(e);
      await transaction.rollback().catch((err) => Logger.error(err));
      throw e;
    }
  }
}
