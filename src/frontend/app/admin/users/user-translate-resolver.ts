import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UserModel } from './user-model';
import { UserResolverService } from './user-resolver.service';

/**
 * Represents the translate resolver.
 * @class
 */
@Injectable()
export class UserTranslateResolver implements Resolve<string> {

  /**
   * Initializes a new instance of the TranslateResolver class.
   * @constructor
   * @param {UserResolverService} service The user resolver service.
   * @param {TranslateService} translateService The angular translate service.
   */
  constructor(
    private service: UserResolverService,
    private translateService: TranslateService
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const userId = route.params.userId || route.params.id;
    if (!this.service.promise) {
      this.service.promise = this.service.getById(userId);
    }

    return this.service.promise.then(user => {
      this.service.promise = null;
      return this.translateService.instant(route.data.code, { username: user.email });
    });
  }
}
