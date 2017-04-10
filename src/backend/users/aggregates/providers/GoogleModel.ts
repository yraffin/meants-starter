/**
 * @swagger
 * definitions:
 *   GoogleModel:
 *     type: object
 *     required:
 *       - id
 *       - token
 *       - email
 *       - name
 *     properties:
 *       id:
 *         type: string
 *       token:
 *         type: string
 *       email:
 *         type: string
 *       name:
 *         type: string
 */
export class GoogleModel {
  id: string;
  token: string;
  email: string;
  name: string;
}
