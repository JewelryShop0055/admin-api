// import your custom grantTypes;

import { AbstractGrantType } from "@node-oauth/oauth2-server";

/**
 * define your type and GrantType class
 *
 * example :
 *
 * {
 *  "google": GoogleGrantType
 * }
 *  */
export default {} as { [key: string]: typeof AbstractGrantType };
