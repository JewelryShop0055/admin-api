/**
 * @openapi
 * components:
 *   parameters:
 *     PagenationLimit:
 *       name: limit
 *       in: query
 *       description: numberic value. min value 1
 *       example: 10
 *       allowEmptyValue: false
 *     PagenationPage:
 *       name: page
 *       in: query
 *       description: numberic value.  min value 0
 *       example: 0
 *       allowEmptyValue: false
 */
export class PagenationQuery {
  page?: string;
  limit?: string;
}
