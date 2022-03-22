import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto";
import { ItemType } from "../types";
import { Category, ItemCategoryRelation } from "../entities";
import sequelize, { OrderItem } from "sequelize";
import { ItemService } from "../item/item.service";
import { WhereOptions } from "sequelize";

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

  async count(type: ItemType, where?: WhereOptions<Category>) {
    return await Category.count({
      where: {
        type,
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
    });
  }

  async remove(id: number, type: ItemType) {
    return await Category.destroy({
      where: {
        id,
        type,
      },
    });
  }
}
