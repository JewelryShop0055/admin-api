import express from "express";
import v1 from "./v1";

const router = express.Router({
  mergeParams: true,
});

// write here your router with prefix
router.use("/v1", v1);

/**
 * @openapi
 * /health:
 *   get:
 *     description: Check Api server Lives
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   example: OK
 *         description: Health OK
 */
router.get("/health", (req, res) => {
  return res.send({
    status: "OK",
  });
});

// 404 error
router.use("*", (req: express.Request, res: express.Response) => {
  return res.sendStatus(404);
});

export default router;
