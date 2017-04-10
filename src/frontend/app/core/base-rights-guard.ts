import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as _ from 'underscore';

import { StorageService } from './storage.service';
import { AuthorizationGuardService } from '../authentication/guards';

/** Represents the user rights storage key. @const {string} */
export const userRightsKey = 'app.ur';

/**
 * Represents the base rights guard service.
 * @class
 * @abstract
 */
export abstract class BaseRigthsGuard implements CanActivate {

  /** Gets or sets the rights @property {string[]} */
  protected rights: string[];

  /**  Gets the user rights. @readonly @property {string[]} */
  protected get userRights() {
    return this.storageService.getItem<string[]>(userRightsKey);
  }

  /**
   * Initialize the AuthorizationGuard class.
   * @constructor
   * @param {AuthorizationGuardService} authorizationGuardService The application authorization guard service.
   * @param {StorageService} storageService The application storage service.
   * @param {Router} router The angular router service.
   * @param {string[]} rights The required rights.
   */
  constructor(
    protected authorizationGuardService: AuthorizationGuardService,
    protected storageService: StorageService,
    protected router: Router,
    ...rights: string[]
  ) {
    this.rights = rights;
  }

  /**
   * Gets a value indicating whether router can activate a route, depending on user rights.
   * @method
   * @return {boolean} Value indicating whether route can be activated.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authorizationGuardService.promise) {
      this.authorizationGuardService.promise = this.authorizationGuardService.checkLogin(state.url);
    }

    return this.authorizationGuardService.promise.then(data => {
      this.authorizationGuardService.promise = null;
      if (!data) {
        // not authorize
        return data;
      };

      const hasRight = this.checkRights();
      if (!hasRight) {
        // navigate to forbidden view.
        this.router.navigate(['/forbidden']);
      }

      return hasRight;
    });
  }

  /**
   * Check if user is logged in.
   * @method
   * @param {string} url The attempted url.
   * @return {boolean} Value indicating whether user has one of the requested rights.
   * @param {StorageService} storageService The application storage service.
   * @param {Router} router The angular router service.
   * @param {string[]} rights The required rights.
   */
  checkRights() {
    return _.some(this.rights, (right) => _.contains(this.userRights, right));
  }
}
