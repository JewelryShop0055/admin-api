import express, { Request } from "express";
import sequelize, {
  Category,
  CategoryTree,
  ItemType,
  CreateCategoryInput,
  PagenationQuery,
} from "../../model";
import { pagenationValidator } from "../../util";
import {
  asyncHandler,
  authenticate,
  itemTypeValidateMiddelware,
  ItemTypeCommonParam,
} from "../../middleware";

interface GetCategryParam extends ItemTypeCommonParam {
  id: string;
}

/**
 * @openapi
 *
 * tags:
 *   - name: "admin-category"
 *     description: "Shop manage service Category manage"
 * components:
 *   parameters:
 *     CategoryId:
 *       name: id
 *       in: path
 *       required: true
 *       allowEmptyValue: false
 *       schema:
 *         type: integer
 *
 */

const router = express.Router({
  mergeParams: true,
});

/**
 * @openapi
 *
 * /admin/category/{itemType}:
 *   get:
 *     tags:
 *       - admin-category
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
 *                 $ref: "#/components/schemas/Category"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DefaultErrorResponse"
 *       401: {}
 *
 */
router.get(
  "/:type",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (req: Request<any, any, undefined, PagenationQuery>, res) => {
      const { type } = req.params as ItemTypeCommonParam;
      const { page, limit } = pagenationValidator(
        Number(req.query.page),
        Number(req.query.limit),
      );

      const categoies = await Category.findAll({
        where: {
          type,
        },
        limit,
        offset: limit * page,
      });

      return res.json(categoies);
    },
  ),
);

/**
 * @openapi
 *
 * /admin/category/{itemType}:
 *   post:
 *     tags:
 *       - admin-category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateCategoryInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DefaultErrorResponse"
 *       401: {}
 *
 *
 */
router.post(
  "/:type",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { type } = req.params as ItemTypeCommonParam;
    const { name } = req.body as Pick<CreateCategoryInput, "name">;

    const value: CreateCategoryInput = {
      type,
      name,
      depth: 0,
    };

    const transaction = await sequelize.transaction();
    try {
      const category = await Category.create(value, {
        transaction,
      });

      const tree = await CategoryTree.create({
        childId: category.id,
        topId: 0,
        parentId: 0,
        depth: category.depth,
      });

      await transaction.commit();

      return res.json(category);
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }),
);

/**
 * @openapi
 *
 * /admin/category/{itemType}/{id}:
 *   get:
 *     tags:
 *       - admin-category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/CategoryId"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DefaultErrorResponse"
 *       401: {}
 *
 *
 */
router.get(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req: Request, res) => {
    const { type, id } = req.params as GetCategryParam;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        status: 400,
        message: "Invalidate id format. id is numberic",
      });
    }

    const category = await Category.findOne({
      where: {
        type,
        id: Number(id),
      },
    });

    if (!category) {
      return res.sendStatus(404);
    }

    return res.json(category);
  }),
);

/**
 * @openapi
 *
 * /admin/category/{itemType}/{id}/list:
 *   get:
 *     tags:
 *       - admin-category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/CategoryId"
 *       - $ref: "#/components/parameters/PagenationPage"
 *       - $ref: "#/components/parameters/PagenationLimit"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Category"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DefaultErrorResponse"
 *       401: {}
 *
 */
router.get(
  "/:type/:id/list",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req: Request, res) => {
    const { type, id } = req.params as GetCategryParam;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        status: 400,
        message: "Invalidate id format. id is numberic",
      });
    }

    const categories = await Category.findAll({
      where: {
        type,
      },
      include: [
        {
          model: CategoryTree,
          as: "parent",
          attributes: [],
          where: {
            parentId: Number(id),
          },
        },
      ],
    });

    return res.json(categories);
  }),
);

/**
 * @openapi
 *
 * /admin/category/{itemType}/{id}:
 *   put:
 *     tags:
 *       - admin-category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/CategoryId"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DefaultErrorResponse"
 *       401: {}
 *
 *
 */
router.put(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { type, id } = req.params as GetCategryParam;
    const { name } = req.body as Pick<CreateCategoryInput, "name">;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        status: 400,
        message: "Invalidate id format. id is numberic",
      });
    }

    const category = await Category.findOne({
      where: {
        type,
        id: Number(id),
      },
    });

    if (!category) {
      return res.sendStatus(404);
    }

    category.set({
      name,
    });

    await category.save();

    return res.json(category);
  }),
);

/**
 * @openapi
 *
 * /admin/category/{itemType}/{id}:
 *   delte:
 *     tags:
 *       - admin-category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/CategoryId"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DefaultErrorResponse"
 *       401: {}
 *
 *
 */
router.delete(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { type, id } = req.params as GetCategryParam;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        status: 400,
        message: "Invalidate id format. id is numberic",
      });
    }

    const category = await Category.findOne({
      where: {
        type,
        id: Number(id),
      },
    });

    if (!category) {
      return res.sendStatus(404);
    }

    await category.destroy();

    return res.sendStatus(204);
  }),
);

/**
 * @openapi
 *
 * /admin/category/{itemType}/{id}:
 *   post:
 *     tags:
 *       - admin-category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/CategoryId"
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateCategoryInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DefaultErrorResponse"
 *       401: {}
 *
 */
router.post(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { type, id } = req.params as GetCategryParam;
    const { name } = req.body as Pick<CreateCategoryInput, "name">;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        status: 400,
        message: "Invalidate id format. id is numberic",
      });
    }

    const parent = await Category.findOne({
      where: {
        type,
        id: Number(id),
      },
      include: [
        {
          model: CategoryTree,
          where: {
            childId: Number(id),
          },
          as: "parentTree",
        },
      ],
    });

    if (!parent) {
      return res.sendStatus(400);
    }

    const value: CreateCategoryInput = {
      type,
      name,
      depth: parent.depth + 1,
    };

    const transaction = await sequelize.transaction();
    try {
      const child = await Category.create(value, {
        transaction,
      });

      const tree = await CategoryTree.create({
        childId: child.id,
        topId: parent.parentTree!.topId,
        parentId: parent.id,
        depth: child.depth,
      });

      await transaction.commit();

      return res.json(child);
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }),
);

export default router;
