import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { UserModel } from './user-model';
import { UserResolverService } from './user-resolver.service';

/**
 * Represents the username of the specified route user identifier.
 * @class
 */
@Injectable()
export class UsernameResolver implements Resolve<string> {

  /**
   * Initializes a new instance of the UsernameResolver class.
   * @constructor
   * @param {UserResolverService} service The user resolver service.
   */
  constructor(
    private service: UserResolverService
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const userId = route.params.userId || route.params.id;
    if (!this.service.promise) {
      this.service.promise = this.service.getById(userId);
    }

    return this.service.promise.then(user => {
      this.service.promise = null;
      return user.email;
    });
  }
}
