import express from "express";
import oauth from "./oauth";
import account from "./account";
import category from "./category";

const router = express.Router({
  mergeParams: true,
});

// write here your router
router.use("/auth", oauth);
router.use("/account", account);
router.use("/category", category);

export default router;
