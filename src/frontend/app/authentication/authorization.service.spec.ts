import { Http } from '@angular/http';
import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { AuthorizationService } from './authorization.service';
import { TESTING_PROVIDERS, TESTING_IMPORTS } from '../../testing-providers';
import { StubTokenHelper } from '../stubs/stub-token-helper';


describe('AuthorizationService', () => {
  const username = 'yannick.raffin@modisfrance.fr';
  const password = 'mdp';
  let tokenHelper: StubTokenHelper;

  beforeEach(() => {
    tokenHelper = new StubTokenHelper();

    TestBed.configureTestingModule({
      imports: [
        TESTING_IMPORTS
      ],
      providers: [
        TESTING_PROVIDERS,
        AuthorizationService
      ]
    });
  });

  it('should ...', inject([AuthorizationService], (service: AuthorizationService) => {
    expect(service).toBeTruthy();
  }));

  it('should log the user in', inject([Http, AuthorizationService], (mockHttp: Http, service: AuthorizationService) => {
    mockHttp.post = jasmine.createSpy('post').and.returnValue(Observable.of({
      json: () => tokenHelper.generateToken(username)
    }));

    service.login({ username, password }).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalled();
      expect(res).toEqual(true);
      expect(service.authInfo.username).toEqual(username);
      expect(service.loggedIn()).toEqual(true);
    });
  }));

  it('login without token received', inject([Http, AuthorizationService], (mockHttp: Http, service: AuthorizationService) => {
    mockHttp.post = jasmine.createSpy('post').and.returnValue(Observable.of({
      json: () => tokenHelper.generateWithoutToken(username)
    }));

    service.login({ username, password }).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalled();
      expect(res).toEqual(false);
    });
  }));

  it('should refresh user token', inject([Http, AuthorizationService], (mockHttp: Http, service: AuthorizationService) => {
    mockHttp.post = jasmine.createSpy('post').and.returnValue(Observable.of({
      json: () => tokenHelper.generateToken(username)
    }));

    service.refresh().subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalled();
      expect(res).toEqual(true);
      expect(service.authInfo.username).toEqual(username);
      expect(service.loggedIn()).toEqual(true);
    });
  }));

  it('should not refresh user token', inject([Http, AuthorizationService], (mockHttp: Http, service: AuthorizationService) => {
    mockHttp.post = jasmine.createSpy('post').and.returnValue(Observable.of({
      json: () => tokenHelper.generateWithoutToken(username)
    }));

    service.refresh().subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalled();
      expect(res).toEqual(false);
    });
  }));
});
