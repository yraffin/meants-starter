import * as express from 'express';
import * as config from 'config';
import * as passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Container } from 'typedi';

import { setupFacebookAuth } from './FacebookStrategy';
import { setupLocalLoginAuth } from './LocalLoginStrategy';
import { setupLocalSignupAuth } from './LocalSignupStrategy';
import { setupJwtAuth, IsLogged, Authorize } from './JwtStrategy';

export function setupAuth(app: express.Express) {
    app.use(passport.initialize());
    setupLocalLoginAuth(app);
    setupLocalSignupAuth(app);
    setupJwtAuth(app);

    if (config.get('facebook')) {
        setupFacebookAuth(app);
    }
};

export { IsLogged, Authorize };
