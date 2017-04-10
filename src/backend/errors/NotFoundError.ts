import { ApiErrorBase } from '../core/ApiErrorBase';

/**
 * @swagger
 * definitions:
 *   NotFoundError:
 *     type: object
 *     required:
 *       - name
 *       - status
 *     properties:
 *       name:
 *         type: string
 *       message:
 *         type: string
 *       status:
 *         type: integer
 */
export class NotFoundError extends ApiErrorBase {
  name: 'NotFoundError';

  /**
   * Initializes a new instance of the NotFoundError class.
   * @constructs
   */
  constructor(message?: string) {
    super(404, message);
  }
}
