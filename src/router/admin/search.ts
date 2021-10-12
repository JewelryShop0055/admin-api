import express from "express";
import { FindOptions, WhereOptions } from "sequelize";
import { asyncHandler, authenticate } from "../../middleware";
import { Category, CraftShop, Item } from "../../model";
import { pagenationValidator } from "../../util";
import { Sequelize } from "sequelize-typescript";

/**
 * @openapi
 *
 * tags:
 *   - name: "admin-search"
 *     description: "Search about Item, Category, CraftShop"
 * components:
 *   parameters:
 *     target:
 *       name: target
 *       in: path
 *       required: true
 *       allowEmptyValue: false
 *       schema:
 *         type: string
 *         enum:
 *           - item
 *           - category
 *           - craftShop
 *     query:
 *       name: q
 *       description: search keyword
 *       example: 하늘 사파이어
 *       in: query
 *       required: true
 *       allowEmptyValue: false
 *       schema:
 *         type: string
 */
const router = express.Router({
  mergeParams: true,
});

/**
 *
 * @openapi
 *
 * /admin/search/{target}:
 *   get:
 *     tags:
 *       - admin-search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/target"
 *       - $ref: "#/components/parameters/query"
 *       - $ref: "#/components/parameters/PagenationPage"
 *       - $ref: "#/components/parameters/PagenationLimit"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf: [
 *                   {
 *                     $ref: "#/components/schemas/Item"
 *                   },
 *                   {
 *                     $ref: "#/components/schemas/Category"
 *                   },
 *                   {
 *                     $ref: "#/components/schemas/CraftShop"
 *                   }
 *                 ]
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.get(
  "/:target",
  authenticate(false),
  asyncHandler(async (req, res) => {
    const target = req.params.target;
    const { page, limit } = pagenationValidator(
      Number(req.query.page),
      Number(req.query.limit),
      30,
    );

    const { type, q, disable } = req.query;

    if (!req.query.q) {
      return res.status(400).json({
        status: 400,
        message: "not allow empty query",
      });
    }

    const keywords = (q as string).split(/\s/);

    const options: FindOptions = {
      limit,
      offset: limit * page,
      order: [["name", "asc"]],
    };

    const result: Array<Item | Category | CraftShop> = [];

    if (target === "item") {
      (options.where as WhereOptions<Item>) = {
        type,
        disable: disable ? disable === "true" : false,
      };

      const d = await Item.search(keywords, options);
      result.push(...d);
    } else if (target === "category") {
      options.where = {
        type,
      };

      result.push(...(await Category.search(keywords, options)));
    } else if (target === "craftShop") {
      result.push(...(await CraftShop.search(keywords, options)));
    } else {
      throw new Error(`Unknown search target: ${target}`);
    }

    return res.json(result);
  }),
);

/**
 *
 * @openapi
 *
 * /admin/search/{target}/autocomplete:
 *   get:
 *     tags:
 *       - admin-search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/target"
 *       - $ref: "#/components/parameters/query"
 *       - $ref: "#/components/parameters/PagenationLimit"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 */
router.get(
  "/:target/autocomplete",
  authenticate(false),
  asyncHandler(async (req, res) => {
    const target = req.params.target;
    const { type, q, disable, limit } = req.query;

    if (!req.query.q) {
      return res.status(400).json({
        status: 400,
        message: "not allow empty query",
      });
    }

    const keywords = (q as string).split(/\s/);

    const options: FindOptions = {
      limit: limit ? (Number(limit) > 30 ? 10 : Number(limit)) : 10,
      order: [["name", "asc"]],
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("name")), "name"]],
    };

    const result: Array<Item | Category | CraftShop> = [];

    if (target === "item") {
      (options.where as WhereOptions<Item>) = {
        type,
        disable: disable ? disable === "true" : false,
      };

      result.push(...(await Item.search(keywords, options)));
    } else if (target === "category") {
      options.where = {
        type,
      };

      result.push(...(await Category.search(keywords, options)));
    } else if (target === "craftShop") {
      result.push(...(await CraftShop.search(keywords, options)));
    } else {
      throw new Error(`Unknown search target: ${target}`);
    }

    return res.json(result.map((v) => v.name));
  }),
);

export default router;
