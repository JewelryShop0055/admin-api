/**
 * @openapi
 * components:
 *   parameters:
 *     paginationLimit:
 *       name: limit
 *       in: query
 *       description: numberic value. min value 1
 *       example: 10
 *       allowEmptyValue: false
 *     paginationPage:
 *       name: page
 *       in: query
 *       description: numberic value.  min value 1
 *       example: 1
 *       allowEmptyValue: false
 */
export class paginationQuery<Order = DefaultOrder> {
  page?: string;
  limit?: string;
  order?: Order;
}

export type DefaultOrder = "id_asc" | "id_desc" | "name_asc" | "name_desc";
