import * as express from 'express';
import * as config from 'config';
import * as passport from 'passport';
import { Strategy, IVerifyOptions } from 'passport-local';
import { Container } from 'typedi';

import { Helpers } from './Helpers';
import { UserModel, UsersService } from '../../users/UsersService';

const opts = {
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass back the entire request to the callback
};

async function verify(req: express.Request, email: string, password: string,
  done: (error: any, user?: any, options?: IVerifyOptions) => void) {
  const usersService = Container.get(UsersService);
  const user = await usersService.findOne({ 'providers.local.username': email },
    { fields: { email: 1, isSystem: 1, 'providers.local': 1, rights: 1 } })
    .catch((reason) => { done(reason); }) as UserModel;

  // if no user found => return message no user.
  if (!user) {
    return done(null, false, { message: 'ERR_USER_CREDENTIALS' });
  }

  if (!usersService.isValidPassword(user, password)) {
    return done(null, false, { message: 'ERR_USER_CREDENTIALS' });
  }

  return done(null, user);
};

export function setupLocalLoginAuth(app: express.Express) {
  passport.use('local-login', new Strategy(opts, verify));

  /**
   * @swagger
   * /auth:
   *   post:
   *     description: Returns the user authentication token.
   *     operationId: authenticate
   *     tags:
   *       - Authentication
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: credentials
   *         in: body
   *         description: The user credentials.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/CredentialModel'
   *     responses:
   *       200:
   *         description: The authorization token.
   *         schema:
   *           $ref: '#/definitions/AuthModel'
   */
  app.post('/auth', passport.authenticate('local-login', { session: false }),
    Helpers.generateToken, Helpers.generateRefreshToken, Helpers.respond);
};
