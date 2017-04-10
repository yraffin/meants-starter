import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { AuthorizationGuardService } from './authorization-guard.service';

/**
 * Represents the authorization guard.
 * @class
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {

  /**
   * Initialize the AuthorizationGuard class.
   * @constructor
   * @param {AuthorizationGuardService} authorizationGuardService The application authorization guard service.
   */
  constructor(private authorizationGuardService: AuthorizationGuardService) { }

  /**
   * Gets a value indicating whether router can activate a route, depending on user authentication.
   * @method
   * @param {ActivatedRouteSnapshot} route The activated route snapshot.
   * @param {RouterStateSnapshot} state The router state snapshot.
   * @return {boolean} Value indicating whether route can be activated.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url = state.url;
    if (!this.authorizationGuardService.promise) {
      this.authorizationGuardService.promise = this.authorizationGuardService.checkLogin(url);
    }
    return this.authorizationGuardService.promise.then(data => {
      this.authorizationGuardService.promise = null;
      return data;
    });
  }
}
