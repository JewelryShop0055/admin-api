import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ItemTypes, ItemType } from "../model";

export interface ItemTypeCommonParam extends ParamsDictionary {
  type: ItemType;
}

export interface ItemTypeWithIdParam extends ItemTypeCommonParam {
  id: string;
}

export const itemTypeValidateMiddelware = (
  req: Request<ItemTypeCommonParam>,
  res: Response,
  next: NextFunction,
) => {
  const type = req.params.type;

  const filter = ItemTypes[type];
  if (!filter) {
    return res.status(400).json({
      status: 400,
      message: "invalidate ItemType on Param. ItemType: [`product`, `parts`]",
    });
  }

  return next();
};
