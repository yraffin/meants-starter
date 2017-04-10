import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * Represents the translate resolver.
 * @class
 */
@Injectable()
export class TranslateResolver implements Resolve<string> {

  /**
   * Initializes a new instance of the TranslateResolver class.
   * @constructor
   * @param {TranslateService} translateService The angular translate service.
   */
  constructor(
    private translateService: TranslateService
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.translateService.get(route.data.code);
  }
}
