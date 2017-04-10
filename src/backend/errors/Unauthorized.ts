import { ApiErrorBase } from '../core/ApiErrorBase';

/**
 * @swagger
 * definitions:
 *   UnauthorizedError:
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
export class UnauthorizedError extends ApiErrorBase {
  name: 'Unauthorized';

  /**
   * Initializes a new instance of the UnauthorizedError class.
   * @constructs
   */
  constructor(message?: string) {
    super(401, message);
  }
}
