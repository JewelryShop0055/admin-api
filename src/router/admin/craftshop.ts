import express, { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

import { asyncHandler, authenticate } from "../../middleware";
import {
  CraftShop,
  CreateCraftShoptInput,
  paginationItems,
  paginationQuery,
} from "../../model";
import { paginationValidator } from "../../util/pagination";

/**
 * @openapi
 *
 * tags:
 *   - name: "admin-craftshop"
 *     description: "Shop manage service Craft shop manage"
 * components:
 *   parameters:
 *     CraftShopId:
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
 * /admin/craftshop:
 *   get:
 *     tags:
 *       - admin-craftshop
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/paginationPage"
 *       - $ref: "#/components/parameters/paginationLimit"
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  required: true
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/CraftShop"
 *                maxPage:
 *                  $ref: "#/components/schemas/maxPage"
 *                currentPage:
 *                  $ref: "#/components/schemas/currentPage"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 *
 */
router.get(
  "",
  authenticate(false),
  asyncHandler(
    async (
      req: Request<
        ParamsDictionary,
        paginationItems<CraftShop>,
        undefined,
        paginationQuery
      >,
      res: Response<paginationItems<CraftShop>>,
    ) => {
      const { currentPage, limit, offset } = paginationValidator(
        Number(req.query.page),
        Number(req.query.limit),
      );

      const data = await CraftShop.findAll({
        limit,
        offset,
      });

      const totalItemCount = await CraftShop.count();

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
 * /admin/craftshop:
 *   post:
 *     tags:
 *       - admin-craftshop
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateCraftShopInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CraftShop"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 *
 *
 */
router.post(
  "",
  authenticate(false),
  asyncHandler(
    async (
      req: Request<ParamsDictionary, CraftShop, CreateCraftShoptInput>,
      res: Response<CraftShop>,
    ) => {
      const value: CreateCraftShoptInput = {
        name: req.body.name,
        postCode: req.body.postCode,
        address: req.body.address,
        detailAddress: req.body.detailAddress,
        phone: req.body.phone,
      };

      const craftshop = await CraftShop.create(value);

      return res.json(craftshop);
    },
  ),
);

/**
 * @openapi
 *
 * /admin/craftshop/{id}:
 *   get:
 *     tags:
 *       - admin-craftshop
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/CraftShopId"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CraftShop"
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
  "/:id",
  authenticate(false),
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const craftshop = await CraftShop.findOne({
      where: {
        id,
      },
    });

    if (!craftshop) {
      return res.sendStatus(404);
    }

    return res.json(craftshop);
  }),
);

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     UpdateCraftShopInput:
 *       type: object
 *       properties:
 *         name:
 *           description: Craft shop name
 *           required: false
 *           type: string
 *         postCode:
 *           description: Craftshop postcode
 *           required: false
 *           type: string
 *           example: 13494
 *         address:
 *           description: Craftshop address
 *           required: false
 *           type: string
 *           example: 경기 성남시 분당구 판교역로 235 (에이치스퀘어 엔동)
 *         detailAddress:
 *           description: Craftshop detail address, like 동, 호
 *           required: false
 *           type: string
 *           example: 404호
 *         phone:
 *           description: Craftshop phone number
 *           required: false
 *           type: string
 *           example: "01012341234"
 *
 * /admin/craftshop/{id}:
 *   put:
 *     tags:
 *       - admin-craftshop
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/CraftShopId"
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateCraftShopInput"
 *            application/x-www-form-urlencoded:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateCraftShopInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CraftShop"
 *       400:
 *         $ref: "#/components/responses/GenericError"
 *       401:
 *         $ref: "#/components/responses/401"
 *       404:
 *         $ref: "#/components/responses/404"
 *       500:
 *         $ref: "#/components/responses/GenericError"
 *
 */
router.put(
  "/:id",
  authenticate(false),
  asyncHandler(
    async (
      req: Request<ParamsDictionary, any, Partial<CreateCraftShoptInput>>,
      res: Response<CraftShop>,
    ) => {
      const id = req.params.id;

      const value: Partial<CreateCraftShoptInput> = {
        name: req.body.name,
        postCode: req.body.postCode,
        address: req.body.address,
        detailAddress: req.body.detailAddress,
        phone: req.body.phone,
      };

      const craftshop = await CraftShop.findOne({
        where: {
          id,
        },
      });

      if (!craftshop) {
        return res.sendStatus(404);
      }

      await craftshop.update(value);
      await craftshop.save();

      return res.json(craftshop);
    },
  ),
);

/**
 * @openapi
 *
 * /admin/craftshop/{itemType}/{id}:
 *   delete:
 *     tags:
 *       - admin-craftshop
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/CraftShopId"
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
  "/:id",
  authenticate(false),
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const craftshop = await CraftShop.findOne({
      where: {
        id,
      },
    });

    if (!craftshop) {
      return res.sendStatus(404);
    }

    await craftshop.destroy();

    return res.sendStatus(204);
  }),
);

export default router;
