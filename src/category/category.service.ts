import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto";
import { ItemType } from "../types";
import { Category, ItemCategoryRelation } from "../entities";
import sequelize, { OrderItem } from "sequelize";
import { ItemService } from "../item/item.service";
import { WhereOptions, Op } from "sequelize";

@Injectable()
export class CategoryService {
  constructor(
    @Inject(forwardRef(() => ItemService))
    private readonly itemService: ItemService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await Category.create(createCategoryDto);
  }

  async existCheck(type: ItemType, name: string) {
    (await Category.findOne({
      where: {
        name,
      },
    }))
      ? true
      : false;
  }

  async findAll(
    type: ItemType,
    where: WhereOptions<Category>,
    offset = 0,
    limit = 10,
    order?: OrderItem[],
  ) {
    return await Category.findAll({
      attributes: [
        ...Object.keys(Category.getAttributes()),
        [
          sequelize.fn("Count", sequelize.col(`itemRelations.categoryId`)),
          `itemCount`,
        ],
      ],
      where: {
        type,
        ...where,
      },
      include: [
        {
          model: ItemCategoryRelation,
          subQuery: true,
          attributes: [],
        },
      ],
      group: [`Category.id`],
      limit,
      order,
      offset,
      subQuery: false,
    });
  }

  async count(type: ItemType | "all", where: WhereOptions<Category> = {}) {
    if (type !== "all") {
      where["type"] = type;
    }

    return await Category.count({
      where: {
        ...where,
      },
    });
  }

  async findOne(id: number, type: ItemType) {
    return await Category.findOne({
      where: {
        type,
        id,
      },
    });
  }

  async update(
    id: number,
    type: ItemType,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return await Category.update(updateCategoryDto, {
      where: {
        id,
        type,
      },
      returning: true,
    })[0][1];
  }

  async remove(id: number, type: ItemType) {
    return await Category.destroy({
      where: {
        id,
        type,
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

    return await Category.findAll({
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
