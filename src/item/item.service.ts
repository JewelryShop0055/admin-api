import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Op, WhereOptions } from "sequelize";

import { CategoryService } from "../category/category.service";
import { CompanyService } from "../company/company.service";
import { CreateItemDto, CreateItemRelationDto, UpdateItemDto } from "../dto";
import {
  Item,
  ItemCategoryRelation,
  ItemCompanyRelation,
  ItemRelation,
} from "../entities";
import { ItemType, ItemTypes } from "../types";
import sequelize from "sequelize";

@Injectable()
export class ItemService {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    // @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
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
    return await Item.update(updateItemDto, {
      where: {
        id,
        type,
      },
    });
  }

        where: {
          id,
          type,
        },
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
            disable: false,
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

  async getParts(prodcutId: string) {
    return await Item.findAll({
      include: [
        {
          model: ItemRelation,
          where: {
            prodcutId,
            disable: false,
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
            disable: false,
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

    preWhereOptions["disable"] = false;

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
}
