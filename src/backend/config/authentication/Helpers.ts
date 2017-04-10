import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import * as express from 'express';
import * as bcrypt from 'bcrypt-nodejs';
import { ObjectID } from 'mongodb';
import { Container } from 'typedi';

import { UserModel, UsersService } from '../../users/UsersService';
import * as Rights from '../../core/Rights';

const secret = config.get('auth.jwt_secret').toString();

/**
 * Represents the helpers class.
 * @class
 */
export class Helpers {

  /** Represents the user service. @private @property {UsersService} */
  private static _userService = null;

  /** Gets the users service. @readonly @property {UsersService} */
  public static get userService() {
    if (!this._userService) {
      this._userService = Container.get(UsersService);
    }

    return this._userService;
  }

  /**
   * Gets the user rights.
   * @method
   * @param {UserModel} user The current user.
   * @returns {string[]}
   */
  static getUserRights(user: UserModel) {
    if (!user.isSystem) {
      return user.rights;
    }

    let result = [];
    Object.keys(Rights).forEach(key => result = result.concat(Rights[key].ALL));
    return result;
  }

  /**
   * Generate the user token.
   * @method
   * @param {express.Request} req The express request.
   * @param {express.Response} res The express response.
   * @param {express.NextFunction} next The express middleware next function.
   */
  static get generateToken() {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      req['token'] = jwt.sign(
        {
          id: req.user.id
        },
        secret,
        {
          expiresIn: 120
        }
      );
      next();
    };
  }

  /**
   * Generate the auth response.
   * @method
   * @param {express.Request} req The express request.
   * @param {express.Response} res The express response.
   */
  static get respond() {
    return (req: express.Request, res: express.Response) => {
      res.status(200).json({
        token: req['token'],
        refresh: req['refresh'],
        username: req.user.email,
        rights: this.getUserRights(req.user)
      });
    };
  }

  /**
   * Generate the token refresh response.
   * @method
   * @param {express.Request} req The express request.
   * @param {express.Response} res The express response.
   */
  static get respondToken() {
    return (req: express.Request, res: express.Response) => {
      res.status(200).json({
        token: req['token'],
        username: req.user.email,
        rights: this.getUserRights(req.user)
      });
    };
  }

  /**
   * Generate the user refresh token.
   * @method
   * @param {express.Request} req The express request.
   * @param {express.Response} res The express response.
   * @param {express.NextFunction} next The express middleware next function.
   */
  static get generateRefreshToken() {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req['token']) {
        return res.status(499).json({
          errors: [{
            message: 'ERR_TOKEN_REQUIRED'
          }]
        });
      }

      req['refresh'] = req.user.id + '.' + bcrypt.hashSync(req.user.email + '-' + Date.now());
      req.user['refresh'] = req['refresh'];
      this.userService.updateOne(req.user).catch(reason => next(reason));

      next();
    };
  }

  /**
   * Log a user with its refresh token.
   * @method
   * @param {express.Request} req The express request.
   * @param {express.Response} res The express response.
   * @param {express.NextFunction} next The express middleware next function.
   */
  static get logUserByRefreshToken() {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const refresh = req.body.refresh;
      const user: UserModel = await this.userService.findOne({ 'refresh': refresh }).catch(reason => next(reason));

      if (!user) {
        res.status(498).json({
          error: {
            status: 498,
            message: 'ERR_INVALID_REFRESH'
          }
        });
      }

      req.user = user;
      return next();
    };
  }

  /**
   * Validate a user refresh token.
   * @method
   * @param {express.Request} req The express request.
   * @param {express.Response} res The express response.
   * @param {express.NextFunction} next The express middleware next function.
   */
  static get validateRefreshToken() {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          error: {
            status: 401,
            message: 'ERR_UNAUTHORIZED'
          }
        });
      }

      const refresh = req.body.refresh;
      const item: UserModel = await this.userService.findOne({ '_id': ObjectID.createFromHexString(req.user.id) },
        { _id: 1, refresh: 1 }).catch(reason => next(reason));

      if (item.refresh === refresh) {
        return next();
      }

      res.status(498).json({
        error: {
          status: 498,
          message: 'ERR_INVALID_REFRESH'
        }
      });
    };
  }
}

