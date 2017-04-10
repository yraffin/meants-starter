import { ApiErrorBase } from '../core/ApiErrorBase';

/**
 * @swagger
 * definitions:
 *   UnprocessableEntityError:
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
export class UnprocessableEntityError extends ApiErrorBase {
  name: 'UnprocessableEntityError';

  /**
   * Initializes a new instance of the UnprocessableEntityError class.
   * @constructs
   */
  constructor(message?: string) {
    super(422, message);
  }
}
