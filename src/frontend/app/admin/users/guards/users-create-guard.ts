import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../../../core/storage.service';
import { BaseRigthsGuard } from '../../../core/base-rights-guard';
import { AuthorizationGuardService } from '../../../authentication/guards';

/**
 * Represents the admin users create guard.
 * @class
 */
@Injectable()
export class UsersCreateGuard extends BaseRigthsGuard {
  /**
   * Initialize the UsersCreateGuard class.
   * @constructor
   * @param {AuthorizationGuardService} authorizationGuardService The application authorization guard service.
   * @param {StorageService} storageService The application storage service.
   * @param {Router} router The angular router service.
   */
  constructor(
    authorizationGuardService: AuthorizationGuardService,
    storageService: StorageService,
    router: Router
  ) {
    super(authorizationGuardService, storageService, router, 'R_API_USER_C');
  }
}
