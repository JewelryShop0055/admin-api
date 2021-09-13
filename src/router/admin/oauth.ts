import express from "express";
import oAuth2Server from "../../oauth/server";

const router = express.Router({
  mergeParams: true,
});

router.post("/token", oAuth2Server.token());
router.get("/health", (req, res) => {
  res.send({
    status: "OK",
  });
});

export default router;
