import * as swaggerJSDoc from 'swagger-jsdoc';
import * as fs from 'fs';
import * as glob from 'glob';

const ctrls = glob.sync('./dist/backend/**/*Controller.js');
const auths = glob.sync('./dist/backend/config/authentication/*.js');
const models = glob.sync('./dist/backend/**/*Model.js');
const errorModels = glob.sync('./dist/backend/errors/**/*.js');
const { version, name, description } = require('../../../package.json');

const options = {
  swaggerDefinition: {
    info: {
      title: name,
      version,
      description
    },
    securityDefinitions: {
      jwt_token: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  },
  apis: [ ...models, ...errorModels, ...ctrls, ...auths ]
};

const spec = swaggerJSDoc(options);
fs.writeFile('./dist/backend/spec.json', JSON.stringify(spec, null, '\t'));
