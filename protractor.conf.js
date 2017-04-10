// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

/*global jasmine */
const { SpecReporter } = require('jasmine-spec-reporter');
const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4201/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () { }
  },
  //useAllAngular2AppRoots: true,
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    browser.driver.manage().window().setSize(1200, 800);
    return browser.getProcessedConfig().then(function (config) {
      jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
        savePath: './reports/e2e/' + config.capabilities.browserName + '/',
        screenshotsFolder: 'images',
        consolidate: true,
        consolidateAll: true
      }));
    });
  },
  params: {
    login: {
      username: 'yannick',
      password: 'modis2016'
    },
    i18n: {
      search: 'login.email'
    }
  }
};
