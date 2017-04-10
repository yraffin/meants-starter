/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Logger } from './logger.service';

describe('Logger', () => {
  const LOGGER_MESSAGE = 'my log message';
  const OPTIONAL_PARAM = { test: 'optional' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Logger]
    });
  });

  it('should ...', inject([Logger], (service: Logger) => {
    expect(service).toBeTruthy();
  }));

  it('should write a log to console ...', inject([Logger], (service: Logger) => {
    spyOn(console, 'log');
    service.log(LOGGER_MESSAGE);
    expect(console.log).toHaveBeenCalledWith(LOGGER_MESSAGE, []);
    service.log(LOGGER_MESSAGE, OPTIONAL_PARAM);
    expect(console.log).toHaveBeenCalledWith(LOGGER_MESSAGE, [OPTIONAL_PARAM]);
  }));

  it('should write an error to console ...', inject([Logger], (service: Logger) => {
    spyOn(console, 'error');
    service.error(LOGGER_MESSAGE);
    expect(console.error).toHaveBeenCalledWith(LOGGER_MESSAGE, []);
    service.error(LOGGER_MESSAGE, OPTIONAL_PARAM);
    expect(console.error).toHaveBeenCalledWith(LOGGER_MESSAGE, [OPTIONAL_PARAM]);
  }));

  it('should write a warn log to console ...', inject([Logger], (service: Logger) => {
    spyOn(console, 'warn');
    service.warn(LOGGER_MESSAGE);
    expect(console.warn).toHaveBeenCalledWith(LOGGER_MESSAGE, []);
    service.warn(LOGGER_MESSAGE, OPTIONAL_PARAM);
    expect(console.warn).toHaveBeenCalledWith(LOGGER_MESSAGE, [OPTIONAL_PARAM]);
  }));

  it('should write a debug log to console ...', inject([Logger], (service: Logger) => {
    spyOn(console, 'log');
    service.debug(LOGGER_MESSAGE);
    expect(console.log).toHaveBeenCalledWith(LOGGER_MESSAGE, [[]]);
    service.debug(LOGGER_MESSAGE, OPTIONAL_PARAM);
    expect(console.log).toHaveBeenCalledWith(LOGGER_MESSAGE, [[OPTIONAL_PARAM]]);
  }));

  it('should not write a debug log to console ...', inject([Logger], (service: Logger) => {
    spyOn(console, 'log');
    service.isProd = true;
    service.debug(LOGGER_MESSAGE);
    expect(console.log).not.toHaveBeenCalled();
  }));
});
