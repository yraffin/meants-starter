/**
 * @swagger
 * definitions:
 *   FacebookModel:
 *     type: object
 *     required:
 *       - id
 *       - token
 *       - refreshToken
 *       - email
 *       - name
 *     properties:
 *       id:
 *         type: string
 *       token:
 *         type: string
 *       refreshToken:
 *         type: string
 *       email:
 *         type: string
 *       name:
 *         type: string
 */
export class FacebookModel {
  id: string;
  token: string;
  refreshToken: string;
  email: string;
  name: string;
}
