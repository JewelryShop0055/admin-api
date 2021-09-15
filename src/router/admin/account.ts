import { Router, Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler";
import authenticate from "../../middleware/authenticate";
import { UpdateUserInput, User } from "../../model";
import UserCrenditional from "../../model/userCreditional";
import UserCrenditionalRealtion from "../../model/userCrenditionalRelation";
import { CrenditionalTypes } from "../../model/userCreditional";

const router = Router({
  mergeParams: true,
});

/**
 * @openapi
 *
 * tags:
 *   - name: "admin-account"
 *     description: "Shop manage service Account manage"
 */

/**
 * @openapi
 *
 * /admin/account/me:
 *   get:
 *     tags:
 *       - "admin-account"
 *     security:
 *       - bearerAuth: []
 *     summary: Current Login User infomation
 *     responses:
 *       '200':
 *          content:
 *            application/json:
 *                schema:
 *                  $ref: "#/components/schemas/User"
 *       '401': {}
 */
router.get("/me", authenticate(false), function (req, res) {
  return res.json(res.locals.oauth.token.user);
});

/**
 *
 * @openapi
 *
 * /admin/account:
 *   put:
 *     tags:
 *       - "admin-account"
 *     security:
 *       - bearerAuth: []
 *     summary: User infomation modify
 *     consumes:
 *       - application/x-www-form-urlencoded
 *       - application/json
 *     produces:
 *       - application/x-www-form-urlencoded
 *       - application/json
 *     requestBody:
 *         content:
 *            application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateUserInput"
 *            application/x-www-form-urlencoded:
 *               schema:
 *                 $ref: "#/components/schemas/UpdateUserInput"
 *     responses:
 *       '200':
 *          content:
 *            application/json:
 *                schema:
 *                  $ref: "#/components/schemas/User"
 */
router.put(
  "/",
  authenticate(false),
  asyncHandler(
    async (req: Request<any, any, UpdateUserInput>, res: Response) => {
      const updatevalue = {
        name: req.body.name,
        phone: req.body.phone?.replace("-", ""),
        email: req.body.email,
      };

      if (Object.keys(updatevalue).filter((v) => updatevalue[v]).length <= 0) {
        return res.status(400).json({
          status: 400,
          message: "There is no value to be changed.",
        });
      }

      const user = await User.findOne({
        where: {
          id: res.locals.oauth.token.user.id,
        },
      });

      if (!user) {
        throw new Error("Not Exist User");
      }

      await user.update(updatevalue);
      await user.save();

      return res.json(user);
    },
  ),
);

/**
 * @openapi
 *
 * /admin/account/password:
 *   put:
 *     tags:
 *       - "admin-account"
 *     security:
 *       - bearerAuth: []
 *     summary: password change
 *     requestBody:
 *         content:
 *            application/x-www-form-urlencoded:
 *               schema:
 *                  type: object
 *                  properties:
 *                    oldPassword:
 *                      type: string
 *                      format: password
 *                      required: true
 *                    newPassword:
 *                      type: string
 *                      format: password
 *                      required: true
 */
router.put(
  "/password",
  authenticate(false),
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body as { [key: string]: string };
    const user: User | undefined = res.locals.oauth.token.user;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 400,
        message: "Not Empty `oldPassowrd` or `newPassword`",
      });
    }

    if (!user) {
      throw new Error("Unknown user");
    }

    const userCrenditional = await UserCrenditional.findOne({
      where: {
        type: CrenditionalTypes.password,
      },
      include: [
        {
          model: UserCrenditionalRealtion,
          include: [
            {
              model: User,
              where: {
                id: user.id,
              },
            },
          ],
        },
      ],
    });

    if (!userCrenditional) {
      throw new Error("Unknown Crenditional");
    }

    if (!(await userCrenditional.verifyPassword(oldPassword))) {
      return res.status(403).json({
        error: 403,
        message: "Not Matched old password",
      });
    }

    userCrenditional.password = newPassword;

    await userCrenditional.save();

    return res.sendStatus(204);
  }),
);

export default router;