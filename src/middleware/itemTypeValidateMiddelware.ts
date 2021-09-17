import express from "express";
import { ItemTypes } from "../model/itemType";

export const itemTypeValidateMiddelware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const type = req.params.type;

  const filter = ItemTypes[type];
  if (!filter) {
    return res.status(400).json({
      status: 400,
      message: "invalidate ItemType on Param. ItemType: [`prodcut`, `parts`]",
    });
  }

  return next();
};
