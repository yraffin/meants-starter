import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

import * as swaggerTools from 'swagger-tools';
import * as passport from 'passport';

export function setupSwagger(app: express.Express, callback?: Function) {
    // resolve the spec
    const spath = path.resolve('./dist/backend/spec.json');
    const file = fs.readFileSync(spath, 'utf8');
    const spec = JSON.parse(file);

    // setup middleware swagger middleware in express
    swaggerTools.initializeMiddleware(spec, (middleware: any) => {
        app.use(middleware.swaggerUi());
        app.use(middleware.swaggerMetadata());
        app.use(setupSwaggerSecurity(middleware));
        app.use(middleware.swaggerValidator({
            validateResponse: true
        }));

        if (callback) {
            callback();
        }
    });
};

function setupSwaggerSecurity(middleware: any) {
    return middleware.swaggerSecurity({
        jwt_token: (req: any, authOrSecDef: any, scopes: any, callback: any) => {
            passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
                if (err) {
                    callback(new Error('Error in passport authenticate'));
                }
                if (!user) {
                    callback(new Error('Failed to authenticate oAuth token'));
                }
                req.user = user;
                return callback();
            })(req, null, callback);
        }
    });
};
