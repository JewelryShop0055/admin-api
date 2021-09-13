import ExpressOAuthServer from "express-oauth-server";
import extendedGrantTypes from "./grantType";
import model from "./model";

export const oAuth2Server = new ExpressOAuthServer({
  model,
  extendedGrantTypes,
  allowBearerTokensInQueryString: false,
  addAcceptedScopesHeader: true,
  addAuthorizedScopesHeader: true,
  allowExtendedTokenAttributes: true,
  allowEmptyState: false,
  authorizationCodeLifetime: 300,
});

export default oAuth2Server;
