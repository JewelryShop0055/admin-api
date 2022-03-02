import express, { Request, Response } from "express";
import { WhereOptions, OrderItem } from "sequelize";
import { asyncHandler, authenticate } from "../../middleware";
import {
  Category,
  CraftShop,
  Item,
  ItemType,
  PaginationResponse,
  paginationQuery,
  SearchOption,
} from "../../model";
import { Sequelize } from "sequelize-typescript";
import { ParamsDictionary } from "express-serve-static-core";
import { DefaultErrorResponse } from "../../model/defaultErrorResponse";
import { DefaultItemQuery } from "./item";

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

type SearchQuery = paginationQuery &
  DefaultItemQuery & { q?: string; type?: ItemType };

/**
 *
 * @openapi
 *
 * /v1/search/{target}:
 *   get:
 *     tags:
 *       - admin-search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/target"
 *       - $ref: "#/components/parameters/query"
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
 *                     oneOf: [
 *                       {
 *                         $ref: "#/components/schemas/Item"
 *                       },
 *                       {
 *                         $ref: "#/components/schemas/Category"
 *                       },
 *                       {
 *                         $ref: "#/components/schemas/CraftShop"
 *                       }
 *                     ]
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
 */
router.get(
  "/:target",
  authenticate(false),
  asyncHandler(
    async (
      req: Request<
        ParamsDictionary,
        PaginationResponse<Item | Category | CraftShop> | DefaultErrorResponse,
        undefined,
        SearchQuery
      >,
      res: Response<
        PaginationResponse<Item | Category | CraftShop> | DefaultErrorResponse
      >,
    ) => {
      const target = req.params.target;

      const { type, q, showDisable, order, page, limit } = req.query;

      if (!req.query.q) {
        return res.status(400).json({
          status: 400,
          message: "not allow empty query",
        });
      }

      const options: SearchOption<any> = {
        keywords: (q as string).split(/\s/),
        findOptions: {
          order: order ? [order.split("_") as OrderItem] : [["name", "asc"]],
        },
        limit: Number(limit),
        page: Number(page),
      };

      if (target === "item") {
        (options.findOptions.where as WhereOptions<Item>) = {
          type,
          disable: showDisable ? showDisable === "true" : false,
        };

        return res.json(await Item.search(options));
      } else if (target === "category") {
        options.findOptions.where = {
          type,
        };

        return res.json(await Category.search(options));
      } else if (target === "craftShop") {
        return res.json(await CraftShop.search(options));
      } else {
        throw new Error(`Unknown search target: ${target}`);
      }
    },
  ),
);

/**
 *
 * @openapi
 *
 * /v1/search/{target}/autocomplete:
 *   get:
 *     tags:
 *       - admin-search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/target"
 *       - $ref: "#/components/parameters/query"
 *       - $ref: "#/components/parameters/paginationLimit"
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
  asyncHandler(
    async (
      req: Request<
        ParamsDictionary,
        string[] | DefaultErrorResponse,
        undefined,
        SearchQuery
      >,
      res: Response<string[] | DefaultErrorResponse>,
    ) => {
      const target = req.params.target;
      const { type, q, showDisable, limit } = req.query;

      if (!req.query.q) {
        return res.status(400).json({
          status: 400,
          message: "not allow empty query",
        });
      }

      const options: SearchOption<any> = {
        keywords: (q as string).split(/\s/),
        findOptions: {
          order: [["name", "asc"]],
          attributes: [
            [Sequelize.fn("DISTINCT", Sequelize.col("name")), "name"],
          ],
        },
        limit: limit ? (Number(limit) > 30 ? 10 : Number(limit)) : 10,
        page: Number(1),
      };

      let result: Array<Item | Category | CraftShop>;

      if (target === "item") {
        (options.findOptions.where as WhereOptions<Item>) = {
          type,
          disable: showDisable ? showDisable === "true" : false,
        };

        result = (await Item.search(options)).data;
      } else if (target === "category") {
        options.findOptions.where = {
          type,
        };

        result = (await Category.search(options)).data;
      } else if (target === "craftShop") {
        result = (await CraftShop.search(options)).data;
      } else {
        throw new Error(`Unknown search target: ${target}`);
      }

      return res.json(result.map((v) => v.name));
    },
  ),
);

export default router;
