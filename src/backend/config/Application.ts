import * as http from "http";
import { ExpressConfig } from './Express';
import { logger } from '../core/logging';
import * as config from 'config';

/**
 * Represents owr BO application.
 * @class
 */
export class Application {

  /** The express server. @property {http.Server} */
  server: http.Server;

  /** The express application configuration. @property {ExpressConfig} */
  express: ExpressConfig;

  /**
   * Initializes a new instance of the Application class.
   * @constructor
   */
  constructor() {
    this.express = new ExpressConfig();

    const port = config.get('ports.http');
    const debugPort = config.get('ports.debug');

    // Start Webserver
    this.server = this.express.app.listen(port, () => {
      logger.info(`
        ------------
        Server Started!
        Http: http://localhost:${port}
        Debugger: http://127.0.0.1:${port}/?ws=127.0.0.1:${port}&port=${debugPort}
        Health: http://localhost:${port}/ping
        API Docs: http://localhost:${port}/docs
        API Spec: http://localhost:${port}/api-docs
        ------------
      `);
    });
  }
}
