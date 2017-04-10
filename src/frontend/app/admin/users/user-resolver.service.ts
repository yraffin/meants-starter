import { Injectable } from '@angular/core';
import 'rxjs/operator/toPromise';

import { UsersService } from './users.service';
import { UserModel } from './user-model';

/**
 * Represents the user resolver service.
 * @class
 */
@Injectable()
export class UserResolverService {

  /**
   * Represents the refresh token promise. @property {Promise<UserModel>}
   */
  promise: Promise<UserModel>;

  /**
   * Initializes a new instance of the UserResolverService.
   * @constructor
   * @param {UsersService} service The users service.
   */
  constructor(private service: UsersService) { }

  /**
   * Gets the user model by its identifier.
   * @method
   * @param {string} userId The requested user identifier.
   * @returns {Promise<UserModel>}
   */
  getById(userId: string) {
    return this.service.getById(userId).toPromise();
  }
}
