import express, { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Sequelize } from "sequelize-typescript";

import {
  asyncHandler,
  authenticate,
  ItemTypeCommonParam,
  itemTypeValidateMiddelware,
} from "../../middleware";
import sequelize, {
  Category,
  CategoryTree,
  CreateCategoryInput,
  DefaultErrorResponse,
  ItemCategoryRelation,
  ItemType,
  paginationItems,
  paginationQuery,
} from "../../model";
import { paginationValidator } from "../../util";

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
 *       - $ref: "#/components/parameters/paginationPage"
 *       - $ref: "#/components/parameters/paginationLimit"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   required: true
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Category"
 *                 maxPage:
 *                   $ref: "#/components/schemas/maxPage"
 *                 currentPage:
 *                   $ref: "#/components/schemas/currentPage"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 *
 */
router.get(
  "/:type",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (
      req: Request<
        ParamsDictionary | ItemTypeCommonParam,
        paginationItems<Category>,
        undefined,
        paginationQuery
      >,
      res: Response<paginationItems<Category>>,
    ) => {
      const { type } = req.params;
      const { currentPage, limit, offset } = paginationValidator(
        Number(req.query.page),
        Number(req.query.limit),
      );

      const data = await Category.findAll({
        attributes: [
          ...Object.keys(Category.rawAttributes),
          [
            Sequelize.fn("Count", Sequelize.col(`itemRelations.categoryId`)),
            `itemCount`,
          ],
        ],
        where: {
          type,
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
        order: ["id"],
        offset,
        subQuery: false,
      });

      const totalItemCount = await Category.count({
        where: {
          type,
        },
      });

      return res.json(
        new paginationItems({
          data,
          currentPage,
          totalItemCount,
          limit,
        }),
      );
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
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 *
 */
router.post(
  "/:type",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (
      req: Request<
        ParamsDictionary | ItemTypeCommonParam,
        Category | DefaultErrorResponse,
        Pick<CreateCategoryInput, "name">
      >,
      res: Response<Category | DefaultErrorResponse>,
    ) => {
      const { type } = req.params;
      const { name } = req.body;

      const value: CreateCategoryInput = {
        type: type as ItemType,
        name,
        depth: 0,
      };

      const exist = await Category.findOne({
        where: value,
      });

      if (exist) {
        return res.status(400).json({
          status: 400,
          message: "Already Exist",
        });
      }

      const transaction = await sequelize.transaction();
      try {
        const category = await Category.create(value, {
          transaction,
        });

        const tree = await CategoryTree.create(
          {
            childId: category.id,
            depth: category.depth,
          },
          {
            transaction,
          },
        );

        await transaction.commit();

        return res.json(category);
      } catch (e) {
        await transaction.rollback();
        throw e;
      }
    },
  ),
);

/**
 * @openapi
 *
 * /admin/category/{itemType}/existcheck:
 *   get:
 *     tags:
 *       - admin-category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - name: name
 *         in: query
 *         description: 중복 확인을 하고 싶은 분류의 이름
 *         example: 목걸이
 *         required: true
 *         allowEmptyValue: false
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exist:
 *                   required: true
 *                   type: boolean
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 *
 */
router.get(
  "/:type/existcheck",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (
      req: Request<
        ParamsDictionary | ItemTypeCommonParam,
        any,
        undefined,
        { name?: string }
      >,
      res,
    ) => {
      const { type } = req.params;
      const name = req.query.name;

      if (!name) {
        return res.status(400).json({
          status: 400,
          message: "required name on Query",
        });
      }

      const categoies = await Category.findOne({
        where: {
          type,
          name,
        },
      });

      return res.json({
        exist: categoies !== null,
      });
    },
  ),
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
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       404:
 *         $ref: "#/components/responses/404"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.get(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (
      req: Request<GetCategryParam | ParamsDictionary>,
      res: Response<Category | DefaultErrorResponse>,
    ) => {
      const { type, id } = req.params;

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
    },
  ),
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
 *       - $ref: "#/components/parameters/paginationPage"
 *       - $ref: "#/components/parameters/paginationLimit"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   required: true
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Category"
 *                 maxPage:
 *                   $ref: "#/components/schemas/maxPage"
 *                 currentPage:
 *                   $ref: "#/components/schemas/currentPage"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       404:
 *         $ref: "#/components/responses/404"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.get(
  "/:type/:id/list",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (
      req: Request<
        ParamsDictionary | GetCategryParam,
        paginationItems<Category>,
        undefined,
        paginationQuery
      >,
      res: Response<paginationItems<Category> | DefaultErrorResponse>,
    ) => {
      const { type, id } = req.params;
      const { currentPage, limit, offset } = paginationValidator(
        Number(req.query.page),
        Number(req.query.limit),
      );

      if (isNaN(Number(id))) {
        return res.status(400).json({
          status: 400,
          message: "Invalidate id format. id is numberic",
        });
      }

      const data = await Category.findAll({
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
        limit,
        offset,
      });

      const totalItemCount = await Category.count({
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

      return res.json(
        new paginationItems({
          data,
          currentPage,
          totalItemCount,
          limit,
        }),
      );
    },
  ),
);

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     UpdateCateogryInput:
 *       type: object
 *       properties:
 *         name:
 *           description: Category name
 *           required: false
 *           type: string
 *
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
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateCateogryInput"
 *            application/x-www-form-urlencoded:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateCateogryInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       404:
 *         $ref: "#/components/responses/404"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.put(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (
      req: Request<
        ParamsDictionary | GetCategryParam,
        Category,
        Pick<CreateCategoryInput, "name">
      >,
      res: Response<Category | DefaultErrorResponse>,
    ) => {
      const { type, id } = req.params;
      const { name } = req.body;

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

      if (name) {
        const exist = await Category.findOne({
          where: {
            name,
            depth: category.depth,
            type: category.type,
          },
        });

        if (exist) {
          return res.status(400).json({
            status: 400,
            message: "Already Exist Name",
          });
        }
      }

      category.set({
        name,
      });

      await category.save();

      return res.json(category);
    },
  ),
);

/**
 * @openapi
 *
 * /admin/category/{itemType}/{id}:
 *   delete:
 *     tags:
 *       - admin-category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ItemType"
 *       - $ref: "#/components/parameters/CategoryId"
 *     responses:
 *       204:
 *         $ref: "#/components/responses/204"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       404:
 *         $ref: "#/components/responses/404"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.delete(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (
      req: Request<ParamsDictionary | GetCategryParam>,
      res: Response<DefaultErrorResponse>,
    ) => {
      const { type, id } = req.params;

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
    },
  ),
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
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       404:
 *         $ref: "#/components/responses/404"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.post(
  "/:type/:id",
  itemTypeValidateMiddelware,
  authenticate(false),
  asyncHandler(
    async (
      req: Request<
        GetCategryParam | ParamsDictionary,
        Category,
        Pick<CreateCategoryInput, "name">
      >,
      res,
    ) => {
      const { type, id } = req.params;
      const { name } = req.body;

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
        type: type as ItemType,
        name,
        depth: parent.depth + 1,
      };

      const exist = await Category.findOne({
        where: value,
        include: [
          {
            model: CategoryTree,
            where: {
              topId: parent.parentTree?.topId || parent.id,
              parentId: parent.id,
              depth: value.depth,
            },
          },
        ],
      });

      if (exist) {
        return res.status(400).json({
          status: 400,
          message: "Already Exist",
        });
      }

      const transaction = await sequelize.transaction();
      try {
        const child = await Category.create(value, {
          transaction,
        });

        const tree = await CategoryTree.create(
          {
            childId: child.id,
            topId: parent.parentTree?.topId || parent.id,
            parentId: parent.id,
            depth: child.depth,
          },
          {
            transaction,
          },
        );

        await transaction.commit();

        return res.json(child);
      } catch (e) {
        await transaction.rollback();
        throw e;
      }
    },
  ),
);

export default router;
