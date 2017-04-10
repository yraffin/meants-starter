import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as health from 'express-ping';
import * as glob from 'glob';

import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';

import { setupLogging } from './Logging';
import { setupSwagger } from './Swagger';
import { setupAuth } from './authentication';
import * as compression from 'compression';

/**
 * Represents the express configuration.
 * @class
 */
export class ExpressConfig {

  /** The express application. @property {express.Express} */
  app: express.Express;

  /**
   * Initializes a new instance of the ExpressConfig class.
   * @constructor
   */
  constructor() {
    this.app = express();

    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(health.ping());

    // use compression
    this.app.use(compression());

    // Point static path to frontend dist
    this.app.use(express.static(path.resolve('dist', 'frontend')));

    // Setup routes
    this.setupExpressServer();
    setupLogging(this.app);
    setupAuth(this.app);

    setupSwagger(this.app, () => {
      this.setupDefaultRedirect();
    });
  }

  /**
   * Setup express server.
   * @method
   */
  setupExpressServer() {
    // setup DI Container
    useContainer(Container);

    // gets specifical directories
    const controllerDirs = glob.sync(path.resolve('dist/backend/**/*Controller.js'));
    const middlewares = glob.sync(path.resolve('dist/backend/**/*Middleware.js'));
    const interceptors = glob.sync(path.resolve('dist/backend/**/*Interceptor.js'));

    useExpressServer(this.app, {
      routePrefix: '/api',
      defaultErrorHandler: false,
      enableValidation: true,
      controllerDirs: controllerDirs,
      middlewares: middlewares,
      interceptors: interceptors
    });
  }

  /**
   * Setup default redirect while 404 occurred.
   * @method
   */
  setupDefaultRedirect() {
    // default return to index.html
    // TODO: Manage angular authorized urls regexp in order to return index.html only when asking them.
    this.app.use(function (req, res, next) {
      console.log(req.path, req.route);
      if (!req.route) {
        res.sendFile(path.resolve('dist/frontend', 'index.html'));
      }
    });
  }
}
