import { Request, Response, NextFunction } from "express";
export function awsCountryInject(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  Object.defineProperties(req, {
    country: {
      enumerable: true,
      configurable: false,
      get() {
        return (
          req.get("region") ||
          req.get("CloudFront-Viewer-Country") ||
          (process.env.I_AM === "LOCAL" ? "KR" : "XX")
        );
      },
    },
  });

  next();
}
