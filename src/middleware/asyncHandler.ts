import { NextFunction, Request, Response, RequestHandler } from "express";

type AsyncHandler<T = void> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<T>;

export function asyncHandler(func: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return (await (func(req, res, next) as unknown)) as AsyncHandler;
    } catch (e) {
      return next(e);
    }
  };
}
