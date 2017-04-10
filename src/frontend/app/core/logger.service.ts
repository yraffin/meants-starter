import { Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../environments/environment';

/**
 * Represents the Logger service
 * @class
 */
@Injectable()
export class Logger {

  /**
   * Value indicating whether environment is production.
   * @property {boolean}
   */
  isProd = false;

  /**
   * Initializes a new instance of the Logger class.
   * @constructor
   * @param {Injector} injector The angular injector service.
   * @param {TranslateService} translateService The angular translate service.
   */
  constructor(
    private injector: Injector,
    private translateService: TranslateService,
  ) {
    this.isProd = environment.production;
  }

  /**
   * Log a message in console.
   * @param {string} message Message to log.
   * @param {any[]} optionalParams Optional logging parameters.
   */
  log(message: string, ...optionalParams: any[]) {
    console.log(message, optionalParams);
  }

  /**
   * Log a message in console as error.
   * @method
   * @param {Error} error The error to manage.
   */
  error(error: any, ...optionalParams: any[]) {
    console.group('BtoC ErrorHandler');
    console.error(error, optionalParams);
    console.groupEnd();
    if (!error.status || !error.message) {
      return;
    }

    let message = error.message;
    if (error['code']) {
      message = this.translateService.instant(error['code']);
    }

    const toastr = this.injector.get(ToastrService) as ToastrService;
    toastr.error(message);
  }

  /**
   * Log a message in console as warn.
   * @param {string} message Message to log.
   * @param {any[]} optionalParams Optional logging parameters.
   */
  warn(message: string, ...optionalParams: any[]) {
    console.warn(message, optionalParams);
  }

  /**
   * Log a message in console as debug depending on environment.
   * @param {string} message Message to log.
   * @param {any[]} optionalParams Optional logging parameters.
   */
  debug(message: string, ...optionalParams: any[]) {
    if (this.isProd) {
      return;
    }

    console.group('BtoC Debug');
    this.log(message, optionalParams);
    console.groupEnd();
  }
}
