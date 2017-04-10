/**
 * @swagger
 * definitions:
 *   CultureModel:
 *     type: object
 *     required:
 *       - code
 *       - name
 *     properties:
 *       code:
 *         type: string
 *       name:
 *         type: string
 */
export class CultureModel {
  code: string;
  name: string;
}
