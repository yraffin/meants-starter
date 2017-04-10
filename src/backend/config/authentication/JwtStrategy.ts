import * as express from 'express';
import * as config from 'config';
import * as passport from 'passport';
import * as _ from 'lodash';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Container } from 'typedi';

import { Helpers } from './Helpers';
import { UserModel, UsersService } from '../../users/UsersService';
import { UnauthorizedError } from '../../errors';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.get('auth.jwt_secret').toString()
};

async function verify(payload: any, done: VerifiedCallback) {
  const id = payload.id;
  const usersService = Container.get(UsersService);
  const user = await usersService.get(id, { fields: { email: 1, rights: 1, isSystem: 1 } })
    .catch((reason) => { done(reason); }) as UserModel;

  // update rights if user system
  user.rights = Helpers.getUserRights(user);

  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
};

export const IsLogged = passport.authenticate('jwt', { session: false });

export const Authorize = (...roles: string[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.user || !req.user.rights) {
      next(new UnauthorizedError(!req.user ? 'Unauthorized' : 'Forbidden'));
      return;
    }

    if (req.user.isSystem) {
      // user system has all rights.
      next(null);
      return;
    }

    if (!_.some(req.user.rights as string[] || [], right => roles.indexOf(right) > -1)) {
      next(new UnauthorizedError('Forbidden'));
      return;
    }

    next(null);
  };
};

export function setupJwtAuth(app: express.Express) {
  passport.use('jwt', new JwtStrategy(opts, verify));

  /**
   * @swagger
   * /token:
   *   post:
   *     description: Refresh the user token.
   *     operationId: generateToken
   *     tags:
   *       - Authentication
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: refresh
   *         in: body
   *         description: The user refresh token.
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             refresh:
   *               type: string
   *     responses:
   *       200:
   *         description: The authorization token.
   *         schema:
   *           $ref: '#/definitions/AuthTokenModel'
   *     security:
   *        - jwt_token: [ ]
   */
  app.post('/token', Helpers.logUserByRefreshToken, Helpers.generateToken, Helpers.respondToken);

  /**
   * @swagger
   * /token/reject:
   *   post:
   *     description: Reject the user refresh token.
   *     operationId: rejectRefreshToken
   *     tags:
   *       - Authentication
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: refresh
   *         in: body
   *         description: The user refresh token.
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             refresh:
   *               type: string
   *     responses:
   *       200:
   *         description: The refresh token has been reject.
   *     security:
   *        - jwt_token: [ ]
   */
  app.post('/token/reject', IsLogged, Helpers.validateRefreshToken, Helpers.generateToken, Helpers.respondToken);
};
