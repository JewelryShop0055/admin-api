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
 *   responses:
 *     GenericError:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DefaultErrorResponse"
 */
export class DefaultErrorResponse {
  status!: number;
  message!: string;
}
