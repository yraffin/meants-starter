import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { AuthorizationService } from '../authorization.service';

/**
 * Represents the authorization guard service.
 * @class
 */
@Injectable()
export class AuthorizationGuardService {

  /**
   * Represents the refresh token promise. @property {Promise<boolean>}
   */
  promise: Promise<boolean>;

  /**
   * Initialize the AuthorizationGuardService class.
   * @constructor
   * @param {AuthorizationService} authorizationService The application authorization service.
   * @param {Router} router The angular router service.
   */
  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) { }

  /**
   * Check if user is logged in.
   * @method
   * @param {string} url The attempted url.
   * @return {boolean} Value indicating whether user is logged in.
   */
  checkLogin(url: string): Promise<boolean> {
    if (!this.authorizationService.authInfo) {
      return Promise.resolve(this.errorAuthentication(url));
    }

    if (this.authorizationService.loggedIn()) {
      return Promise.resolve(true);
    }

    return this.authorizationService.refresh()
      .toPromise().then(
      result => {
        if (result === true) {
          return true;
        }

        return this.errorAuthentication(url);
      },
      reason => {
        return this.errorAuthentication(url);
      });
  }

  /**
   * Execute on authentication failed.
   * @method
   * @param {string} url The redirect url.
   * @return {boolean}
   */
  errorAuthentication(url): boolean {
    // store attempted URL for redirection
    this.authorizationService.redirectUrl = url;

    // navigate to login page.
    this.router.navigate(['/login']);
    return false;
  }

}
