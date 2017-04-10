import { ErrorHandler } from '@angular/core';

import { Logger } from './logger.service';
import { environment } from '../../environments/environment';

/**
 * Represents the Application error handler.
 * @class
 */
export class AppErrorHandler implements ErrorHandler {

    /**
     * Initializes a new instance of the BtoCErrorHandler class.
     * @constructor
     */
    constructor(
        private logger: Logger,
        private rethrowError?: boolean
    ) {
    }

    /**
     * Handle error.
     * @method
     * @param {any} error The current handled error.
     */
    handleError(error: any) {
        this.logger.error(error._body ? JSON.parse(error._body) : error);

        if (this.rethrowError) {
            throw (error);
        }
    }
}

/**
 * Function which represents the error handler factory.
 * @method
 * @param {Logger} logger The application logger.
 * @returns {BtoCErrorHandler}
 */
export function errorHandlerFactory(logger: Logger) {
    return new AppErrorHandler(logger, !environment.production);
}
