import express from "express";
import oauth from "./oauth";
import account from "./account";
import item from "./item";
import category from "./category";
import craftshop from "./craftshop";

const router = express.Router({
  mergeParams: true,
});

// write here your router
router.use("/auth", oauth);
router.use("/account", account);
router.use("/category", category);
router.use("/craftshop", craftshop);
router.use("/item", item);

export default router;
