import express, { Request } from "express";
import { authenticate, asyncHandler } from "../../middleware";
import { CraftShop } from "../../model";
import { CreateCraftShoptInput } from "../../model/craftShop";
import { pagenationValidator } from "../../util/pagenation";

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
 *       - $ref: "#/components/parameters/PagenationPage"
 *       - $ref: "#/components/parameters/PagenationLimit"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CraftShop"
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
  asyncHandler(async (req, res) => {
    const { page, limit } = pagenationValidator(
      Number(req.query.page),
      Number(req.query.limit),
    );

    const craftshop = await CraftShop.findAll({
      limit,
      offset: limit * page,
    });

    return res.json(craftshop);
  }),
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
  asyncHandler(async (req: Request<any, any, CreateCraftShoptInput>, res) => {
    const value: CreateCraftShoptInput = {
      name: req.body.name,
      postCode: req.body.postCode,
      address: req.body.address,
      detailAddress: req.body.detailAddress,
      phone: req.body.phone,
    };

    const craftshop = await CraftShop.create(value);

    return res.json(craftshop);
  }),
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
    async (req: Request<any, any, Partial<CreateCraftShoptInput>>, res) => {
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
