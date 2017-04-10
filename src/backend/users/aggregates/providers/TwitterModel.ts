/**
 * @swagger
 * definitions:
 *   TwitterModel:
 *     type: object
 *     required:
 *       - id
 *       - token
 *       - username
 *     properties:
 *       id:
 *         type: string
 *       token:
 *         type: string
 *       username:
 *         type: string
 *       displayName:
 *         type: string
 */
export class TwitterModel {
  id: string;
  token: string;
  username: string;
  displayName: string;
}
