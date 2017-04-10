import { HttpError } from 'routing-controllers';

/**
 * Represents the default Api Error class.
 * @class
 */
export abstract class ApiErrorBase extends HttpError implements Error {
  abstract name;

  /**
   * Initializes a new instance of the ApiErrorBase class.
   * @constructs
   */
  constructor(status, message?: string) {
    super(status, message);
    if (!!message) {
      return;
    }

    this.message = `${this.name} occurred`;
  }
}
