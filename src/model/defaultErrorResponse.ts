/**
 * @openapi
 * components:
 *   schemas:
 *     DefaultErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           description: HTTP STATUS CODE
 *           required: true
 *           type: integer
 *           example: 400
 *         message:
 *           description: error message
 *           required: true
 *           type: "string"
 *           example: Invalidate id foramt. id is numberic
 */
export class DefaultErrorResponse {
  status!: number;
  message!: string;
}
