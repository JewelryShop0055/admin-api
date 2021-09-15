import express from "express";
import oauth from "./oauth";
import account from "./account";

const router = express.Router({
  mergeParams: true,
});

// write here your router
router.use("/auth", oauth);
router.use("/account", account);

export default router;
