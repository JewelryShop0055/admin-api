import ExpressOAuthServer = require("express-oauth-server");

declare global {
  namespace Express {
    interface AuthInfo {
      scope?: string | string[];
    }

    // interface Request {
    //   country: string;
    // }

    interface Application {
      oauth: ExpressOAuthServer;
    }
  }
}
