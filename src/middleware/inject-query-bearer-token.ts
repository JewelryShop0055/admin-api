import { Request, Response, NextFunction } from "express";

export function queryBearTokenInject(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.query.access_token) {
    req.headers.authorization = "Bearer " + req.query.access_token;
    req.query.access_token = undefined;
  }

  next();
}
