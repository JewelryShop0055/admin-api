import { NextFunction, Request, Response } from "express";
import oAuth2Server from "../oauth/server";

export function authenticate(isPublic = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const hasToken = req.headers.authorization;

    if (!hasToken && isPublic) {
      return next();
    } else {
      return oAuth2Server.authenticate()(req, res, next);
    }
  };
}
