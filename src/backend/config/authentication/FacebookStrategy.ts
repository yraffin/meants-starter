import * as express from 'express';
import * as config from 'config';
import * as passport from 'passport';
import { Strategy, IStrategyOption, Profile } from 'passport-facebook';
import { Container } from 'typedi';

import { UserModel, UsersService } from '../../users/UsersService';

let opts = {
  // by default, local strategy uses username and password, we will override with email
  clientID: config.get('facebook.clientID'),
  clientSecret: config.get('facebook.clientSecret'),
  callbackURL: config.get('facebook.callbackURL') // allows us to pass back the entire request to the callback
} as IStrategyOption;

async function verify(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) {
  const usersService = Container.get(UsersService);
  let user = await usersService.findOne({ 'providers.facebook.id': profile.id }).catch(reason => done(reason)) as UserModel;

  // if user found => return message user already exists.
  if (user) {
    return done(null, user);
  }

  // create user
  user = new UserModel();
  user.providers = {
    facebook: {
      'id': profile.id,
      'token': accessToken,
      'refreshToken': refreshToken,
      'email': profile.emails ? profile.emails[0].value : profile.username,
      'name': profile.displayName
    }
  };

  user.email = user.providers.facebook.email;
  await usersService.save(user).catch(reason => done(reason));

  return done(null, user, { message: 'FB_USER_CREATE' });
};

export function setupFacebookAuth(app: express.Express) {
  passport.use('facebook', new Strategy(opts, verify));

  // define routing
  app.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: [] }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/profile?access_token=' + req.user.access_token);
    }
  );
};
