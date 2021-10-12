import express from "express";

import account from "./account";
import category from "./category";
import craftshop from "./craftshop";
import item from "./item";
import oauth from "./oauth";
import search from "./search";

const router = express.Router({
  mergeParams: true,
});

// write here your router
router.use("/auth", oauth);
router.use("/account", account);
router.use("/category", category);
router.use("/craftshop", craftshop);
router.use("/item", item);
router.use("/search", search);

export default router;
