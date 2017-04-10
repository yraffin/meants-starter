import { AuthTokenModel } from './AuthTokenModel';

/**
 * @swagger
 * definitions:
 *   AuthModel:
 *     type: object
 *     properties:
 *       token:
 *         type: string
 *       refresh:
 *         type: string
 */
export class AuthModel extends AuthTokenModel {
  refresh: string;
}
