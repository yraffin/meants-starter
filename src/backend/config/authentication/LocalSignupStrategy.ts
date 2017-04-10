import * as express from 'express';
import * as config from 'config';
import * as passport from 'passport';
import { Strategy, IVerifyOptions } from 'passport-local';
import { Container } from 'typedi';

import { Helpers } from './Helpers';
import { UserModel, UsersService, RegisterModel } from '../../users/UsersService';

const opts = {
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass back the entire request to the callback
};

async function verify(req: express.Request, email: string, password: string,
  done: (error: any, user?: any, options?: IVerifyOptions) => void) {
  const usersService = Container.get(UsersService);
  let user = await usersService.findOne({ 'providers.local.username': email }).catch((reason) => { done(reason); }) as UserModel;

  // if user found => return message user already exists.
  if (user) {
    return done(null, false, { message: 'ERR_USER_EXISTS' });
  }

  // get the model user
  const model = req.body as RegisterModel;

  if (model.password !== model.passwordConfirm) {
    return done(null, false, { message: 'ERR_PWD_CONFIRM' });
  }

  user = new UserModel();
  user.email = email;
  user.lastname = model.lastname;
  user.firstname = model.firstname;
  user.providers = {
    local: {
      'username': email,
      'salt': '',
      'hash': ''
    }
  };

  if (model['rights']) {
    user.rights = model['rights'];
  }

  usersService.createPassword(user, password);
  const newUser = await usersService.insertOne(user);
  return done(null, newUser);
};

export function setupLocalSignupAuth(app: express.Express) {
  passport.use('local-signup', new Strategy(opts, verify));

  /**
   * @swagger
   * /register:
   *   post:
   *     description: Register the user and eturns the user authentication token.
   *     operationId: register
   *     tags:
   *       - Authentication
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: userModel
   *         in: body
   *         description: The user registration model.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/RegisterModel'
   *     responses:
   *       200:
   *         description: The authorization token.
   *         schema:
   *           $ref: '#/definitions/AuthModel'
   */
  app.post('/register', passport.authenticate('local-signup', { session: false }),
    Helpers.generateToken, Helpers.generateRefreshToken, Helpers.respond);
};
