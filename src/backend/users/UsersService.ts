import { Service, Inject } from 'typedi';
import * as bcrypt from 'bcrypt-nodejs';

import { UserModel } from './aggregates/UserModel';
import { RegisterModel } from './aggregates/RegisterModel';
import { MongoService, PaginationFilter } from '../core/MongoService';
import { MongoCollection } from '../core/decorators';
import { NotFoundError, UnprocessableEntityError } from '../errors';

/**
 * Represents the users service.
 * @class
 * @extends {MongoService<UserModel>}
 */
@MongoCollection('Users')
export class UsersService extends MongoService<UserModel> {

  /**
   * Create a user.
   * @method
   * @param {RegisterModel} data The user data model.
   * @returns {Promise<UserModel>}
   */
  async createUser(data: RegisterModel) {
    const user: UserModel = {
      email: data.email,
      civility: data.civility,
      firstname: data.firstname,
      lastname: data.lastname,
      providers: {
        local: {
          username: data.email,
          salt: '',
          hash: ''
        }
      }
    };

    this.createPassword(user, data.password);
    return this.save(user);
  }

  /**
   * Encrypt the user password.
   * @method
   * @param {UserModel} user The curretnt user.
   * @param {string} password The user password to encrypt.
   */
  createPassword(user: UserModel, password: string) {
    user.providers.local.salt = bcrypt.genSaltSync(8);
    user.providers.local.hash = bcrypt.hashSync(password, user.providers.local.salt);
  }

  /**
   * Check if password is valid.
   * @method
   * @param {UserModel} user The current user.
   * @param {string} password The password to validate.
   * @returns {boolean}
   */
  isValidPassword(user: UserModel, password: string) {
    return bcrypt.compareSync(password, user.providers.local.hash);
  }

  /**
   * Gets the user rights.
   * @method
   * @param {string} id The current user identifier.
   * @returns {Promise<string[]>}
   */
  async getUserRights(id: string) {
    const user = await this.get(id, { fields: { rights: 1 } });
    if (!user) {
      throw new NotFoundError(`user not found: ${id}`);
    }

    return user.rights;
  }

  /**
   * Save the user rights.
   * @method
   * @param {string} id The current user identifier.
   * @param {string[]} data The list of user rights.
   * @returns {Promise<string[]>}
   */
  async saveUserRights(id: string, data: string[]) {
    const user = await this.get(id, { fields: { rights: 1 } });
    if (!user) {
      throw new NotFoundError(`user not found: ${id}`);
    }

    user.rights = data;
    await this.updateOne(user);
    return data;
  }
}

export { UserModel, RegisterModel, PaginationFilter };
