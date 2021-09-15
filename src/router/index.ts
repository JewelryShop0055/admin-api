import express from "express";
import v1 from "./v1";
import admin from "./admin";

const router = express.Router({
  mergeParams: true,
});

// write here your router with prefix
router.use("/admin", admin);
router.use("/v1", v1);

/**
 * @openapi
 * /health:
 *   get:
 *     description: Check Api server Lives
 *     responses:
 *       200:
 *         description: Health OK
 *         example: OK
 */
router.get("/health", (req, res) => {
  res.send({
    status: "OK",
  });
});

// 404 error
router.use("*", (req: express.Request, res: express.Response) => {
  return res.sendStatus(404);
});

export default router;
