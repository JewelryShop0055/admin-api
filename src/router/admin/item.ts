import express, { Request } from "express";
import {
  asyncHandler,
  authenticate,
  itemTypeValidateMiddelware,
} from "../../middleware";
import sequelize, {
  CreateItemCategoryInput,
  CreateItemCraftShopRelationInput,
  CreateItemInput,
  Category,
  CategoryTree,
  Item,
  ItemCategoryRelation,
  ItemCraftShopRelation,
  ItemType,
  ItemTypes,
  ItemUnitTypes,
  PagenationQuery,
} from "../../model";
import { pagenationValidator, unitValidator } from "../../util";
import ItemRelation from "../../model/ItemRelation";

/**
 * @openapi
 *
 * tags:
 *   - name: "admin-item"
 *     description: "Shop manage service Item(Parts, Product) manage"
 * components:
 *   parameters:
 *     ItemId:
 *       name: id
 *       in: path
 *       required: true
 *       allowEmptyValue: false
 *       schema:
 *         type: string
 *     partsId:
 *       name: partsId
 *       in: path
 *       required: true
 *       allowEmptyValue: false
 *       schema:
 *         type: string
 *
 */

const router = express.Router({
  mergeParams: true,
});

/**
 *
 * @openapi
 *
 * /admin/item/{itemType}:
 *   get:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/PagenationPage"
 *       - $ref: "#/components/parameters/PagenationLimit"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Item"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.get(
  "/:type",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req: Request<any, any, PagenationQuery>, res) => {
    const { page, limit } = pagenationValidator(
      Number(req.query.page),
      Number(req.query.limit),
    );

    const type: ItemType = req.params.type;

    const items = await Item.findAll({
      where: {
        type,
        disable: false,
      },
      offset: limit * page,
      limit: limit,
    });

    return res.json(items);
  }),
);

/**
 * @openapi
 * /admin/item/{itemType}:
 *   post:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateItemInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Item"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.post(
  "/:type",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (
      req: Request<
        any,
        any,
        CreateItemInput &
          Partial<CreateItemCategoryInput> &
          Partial<CreateItemCraftShopRelationInput>
      >,
      res,
    ) => {
      const type = req.params.type as ItemType;
      const values: CreateItemInput = {
        type,
        name: req.body.name,
        partNo: req.body.partNo,
        unit: unitValidator(req.body.unit) || ItemUnitTypes.ea,
        defaultFee: Number(req.body.defaultFee) || undefined,
        extraFee: Number(req.body.extraFee) || undefined,
      };

      const categoryId = Number(req.body.categoryId);

      if (isNaN(categoryId) && !req.body.categoryId) {
        return res.status(400).json({
          status: 400,
          message: "Invalidate Category Id. Category id is Number or NULL",
        });
      } else if (
        req.params.type === ItemTypes.product &&
        !req.body.craftShopId
      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Invalidate CraftShopi Id. CraftShop id is Require product type",
        });
      }

      const transaction = await sequelize.transaction();

      try {
        const item = await Item.create(values, {
          transaction,
        });

        if (categoryId) {
          const categoryValues: CreateItemCategoryInput = {
            categoryId,
            itemId: item.id,
          };

          const categoryRelation = await ItemCategoryRelation.create(
            categoryValues,
            {
              transaction,
            },
          );
        }

        if (type === ItemTypes.product) {
          const itemCraftshopValues: CreateItemCraftShopRelationInput = {
            itemId: item.id,
            craftShopId: req.body.craftShopId as string,
          };

          const craftShopRelation = await ItemCraftShopRelation.create(
            itemCraftshopValues,
            {
              transaction,
            },
          );
        }

        await transaction.commit();

        return res.json(item);
      } catch (e) {
        await transaction.rollback();
      }
    },
  ),
);

/**
 * @openapi
 * /admin/item/{itemType}/{id}:
 *   get:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/ItemId"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Item"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.get(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { id, type } = req.params;

    const item = await Item.findOne({
      where: {
        id,
        type,
      },
    });

    if (!item) {
      return res.sendStatus(404);
    }

    return res.json(item);
  }),
);

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     UpdateItemInput:
 *       type: object
 *       properties:
 *         partNo:
 *           description: Product management No. If Product type required.
 *           type: string
 *           required: false
 *         name:
 *           description: item name.
 *           type: string
 *           required: true
 *         unit:
 *           $ref: "#/components/schemas/ItemUnitType"
 *         defaultFee:
 *           description: 공임비.
 *           type: integer
 *           required: false
 *         extraFee:
 *           description: 기타 공임비(세공비 등).
 *           type: integer
 *           required: false
 *
 * /admin/item/{itemType}/{id}:
 *   put:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/ItemId"
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateItemInput"
 *            application/x-www-form-urlencoded:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateItemInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Item"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.put(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (req: Request<any, any, Partial<CreateItemInput>>, res) => {
      const type: ItemType = req.params.type;
      const id = req.params.id;
      const values: Partial<CreateItemInput> = {
        name: req.body.name,
        unit: unitValidator(req.body.unit),
        defaultFee: Number(req.body.defaultFee) || undefined,
        extraFee: Number(req.body.extraFee) || undefined,
      };

      const item = await Item.findOne({
        where: {
          type,
          id,
        },
      });

      if (!item) {
        return res.sendStatus(404);
      }

      await item.update(values);
      await item.save();

      return res.json(item);
    },
  ),
);

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     UpdateItemCateogryInput:
 *       type: object
 *       properties:
 *         categoryId:
 *           description: Category id
 *           required: true
 *           type: integer
 *
 * /admin/item/{itemType}/{id}/category:
 *   put:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/ItemId"
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateItemCateogryInput"
 *            application/x-www-form-urlencoded:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateItemCateogryInput"
 *     responses:
 *       204: {}
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.put(
  "/:type/:id/category",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (req: Request<any, any, Partial<CreateItemCategoryInput>>, res) => {
      const type: ItemType = req.params.type;
      const id = req.params.id;
      const categoryId = Number(req.body.categoryId);

      if (isNaN(categoryId)) {
        return res.status(400).json({
          status: 400,
          message: "Invalidate Category Id. Category id is Number or NULL",
        });
      }

      const item = await Item.findOne({
        where: {
          type,
          id,
        },
      });

      if (!item) {
        return res.sendStatus(404);
      }

      const relation = await ItemCategoryRelation.findOne({
        where: {
          id,
        },
      });

      if (relation) {
        await relation.update({
          categoryId,
        });

        await relation.save();
      } else {
        const categoryRelation = await ItemCategoryRelation.create({
          categoryId,
          itemId: id,
        });
      }

      return res.sendStatus(204);
    },
  ),
);

/**
 * @openapi
 * /admin/item/{itemType}/{id}/craftshop:
 *   put:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/ItemId"
 *     responses:
 *       204: {}
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.put(
  "/product/:id/craftshop",
  authenticate(false),
  asyncHandler(
    async (
      req: Request<any, any, Partial<CreateItemCraftShopRelationInput>>,
      res,
    ) => {
      const type: ItemType = "product";
      const id = req.params.id;
      const craftShopId = req.body.craftShopId;

      if (!craftShopId) {
        return res.status(400).json({
          status: 400,
          message:
            "Invalidate CraftShopi Id. CraftShop id is Require product type",
        });
      }

      const item = await Item.findOne({
        where: {
          type,
          id,
        },
      });

      if (!item) {
        return res.sendStatus(404);
      }

      const relation = await ItemCraftShopRelation.findOne({
        where: {
          itemId: id,
        },
      });

      if (relation) {
        await relation.update({
          craftShopId,
        });

        await relation.save();
      } else {
        const newRelation = await ItemCraftShopRelation.create({
          itemId: id,
          craftShopId,
        });
      }
      return res.sendStatus(204);
    },
  ),
);

/**
 * @openapi
 * /admin/item/{itemType}/{id}:
 *   delete:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/ItemId"
 *     responses:
 *       204: {}
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.delete(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { id, type } = req.params;

    const item = await Item.findOne({
      where: {
        id,
        type,
        disable: false,
      },
    });

    if (!item) {
      return res.sendStatus(404);
    }

    await item.update({
      disable: true,
    });

    return res.json(item);
  }),
);

/**
 * @openapi
 * /admin/item/{itemType}/{id}/category:
 *   get:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/ItemId"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Category"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.get(
  "/:type/:id/category",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { type, id } = req.params;

    const categories = await Category.findAll({
      include: [
        {
          model: CategoryTree,
          as: "parentTree",
          include: [
            {
              model: Category,
              as: "parent",
            },
          ],
        },
        {
          model: ItemCategoryRelation,
          where: {
            itemId: id,
          },
          include: [
            {
              model: Item,
              where: {
                type,
                id,
              },
            },
          ],
        },
      ],
    });

    return res.json(categories);
  }),
);

/**
 * @openapi
 * /admin/item/{type}/{id}/category/{categoryId}:
 *   delete:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/ItemId"
 *       - name: categoryId
 *         in: path
 *         required: true
 *         allowEmptyValue: false
 *         schema:
 *           type: integer
 *     responses:
 *       204: {}
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.delete(
  "/:type/:id/category/:categoryId",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { type } = req.params;
    const categoryId = req.params.categoryId;

    if (!categoryId) {
      return res.status(400).json({
        status: 400,
        message: "Invalidate Category Id",
      });
    }

    const item = await Item.findOne({
      where: {
        type,
        id,
      },
    });

    if (!item) {
      return res.sendStatus(404);
    }

    await ItemCategoryRelation.destroy({
      where: {
        itemId: id,
        categoryId,
      },
    });

    return res.sendStatus(204);
  }),
);

/**
 * @openapi
 * /admin/item/product/{id}/parts:
 *   get:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemId"
 *       - $ref: "#/components/parameters/PagenationPage"
 *       - $ref: "#/components/parameters/PagenationLimit"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Item"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.get(
  "/product/:id/parts",
  authenticate(false),
  asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const { page, limit } = pagenationValidator(
      Number(req.query.page),
      Number(req.query.limit),
    );
    const parts = await Item.findAll({
      include: [
        {
          model: ItemRelation,
          where: {
            productId,
          },
          as: "productRelation",
        },
      ],
      limit,
      offset: page * limit,
    });

    return res.json(parts);
  }),
);

/**
 * @openapi
 *
 *
 * /admin/item/product/{id}/parts:
 *   post:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemId"
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                 $ref: "#/components/schemas/CreateItemRealtionInput"
 *            application/x-www-form-urlencoded:
 *               schema:
 *                 $ref: "#/components/schemas/CreateItemRealtionInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemRelation"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.post(
  "/product/:id/parts",
  authenticate(false),
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const values = {
      productId: id,
      partsId: req.body.partsId,
      amount: Number(req.body.amount),
    };

    const product = await Item.findOne({
      where: {
        type: ItemTypes.product,
        id,
      },
    });

    if (!product) {
      return res.sendStatus(404);
    }

    const relation = await ItemRelation.findOne({
      where: {
        productId: id,
        partsId: values.partsId,
      },
    });

    if (relation) {
      return res.status(400).json({
        status: 400,
        message: "Already Exist Product-Parts Relation",
      });
    }

    const parts = await Item.findOne({
      where: {
        type: ItemTypes.parts,
        id: values.partsId,
      },
    });

    if (!parts) {
      return res.status(400).json({
        status: 400,
        message: "Not Exists Parts",
      });
    }

    const newRelation = await ItemRelation.create(values);

    return res.json(newRelation);
  }),
);

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     UpdateItemRelationInput:
 *       type: object
 *       properties:
 *         amount:
 *           description: Parts Amount for Product
 *           required: true
 *           type: number
 *           format: float
 *           example: 3.14
 *
 * /admin/item/product/{id}/parts/{partsId}:
 *   put:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemId"
 *       - $ref: "#/components/parameters/partsId"
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateItemRelationInput"
 *            application/x-www-form-urlencoded:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateItemRelationInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemRelation"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.put(
  "/product/:id/parts/:partsId",
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { id, partsId } = req.params;

    const whereOption = {
      productId: id,
      partsId,
    };

    const values = {
      amount: Number(req.body.amount),
    };

    const relation = await ItemRelation.findOne({
      where: whereOption,
    });

    if (!relation) {
      return res.sendStatus(404);
    }

    await relation.update(values);

    return res.json(relation);
  }),
);

/**
 * @openapi
 *
 * /admin/item/product/{id}/parts/{partsId}:
 *   delete:
 *     tags:
 *       - admin-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemId"
 *       - $ref: "#/components/parameters/partsId"
 *     responses:
 *       204: {}
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401: {}
 *       404: {}
 *       500:
 *         $ref: "#/components/responses/GenericError"
 *
 */
router.delete(
  "/product/:id/parts/:partsId",
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { id, partsId } = req.params;

    if (!id || !partsId) {
      return res.status(400).json({
        status: 400,
        message: "Invalidate product Id or parts Id",
      });
    }

    const product = await Item.findOne({
      where: {
        type: ItemTypes.product,
        id,
      },
    });

    if (!product) {
      return res.sendStatus(404);
    }

    const parts = await Item.findOne({
      where: {
        type: ItemTypes.parts,
        id: partsId,
      },
    });

    if (!parts) {
      return res.sendStatus(404);
    }

    await ItemRelation.destroy({
      where: {
        productId: id,
        partsId,
      },
    });

    return res.sendStatus(204);
  }),
);

export default router;
