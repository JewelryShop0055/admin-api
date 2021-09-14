import express from "express";
import oauth from "./oauth";

const router = express.Router({
  mergeParams: true,
});

// write here your router
router.use("/auth", oauth);

/**
 * @openapi
 * /health:
 *   get:
 *     description: Check Api server Lives
 *     responses:
 *       200:
 *         description: Just return "OK"
 */
router.get("/health", (req, res) => {
  res.send({
    status: "OK",
  });
});

export default router;
