import express from "express";
import oauth from "./oauth";

const router = express.Router({
  mergeParams: true,
});

// write here your router
router.use("/auth", oauth);

export default router;
