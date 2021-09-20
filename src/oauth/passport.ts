import express from "express";
import passport from "passport";
import {
  Strategy as BearerStrategy,
  IVerifyOptions,
} from "passport-http-bearer";

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  return done(null, user.id);
});

passport.deserializeUser<any, any>(
  (id: any, done: (err: any, user?: any) => void) => {
    /* TODO */
  },
);

passport.use(
  new BearerStrategy(
    {
      passReqToCallback: true,
    },
    async (
      req: express.Request,
      accessToken: string,
      done: (
        error: Error,
        user?: any,
        options?: IVerifyOptions | string,
      ) => void,
    ) => {
      /* TODO */
    },
  ),
);

export { passport };
export default passport;
