/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Headers, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { UserResolverService } from './user-resolver.service';
import { TESTING_PROVIDERS, TESTING_IMPORTS } from '../../../testing-providers';
import { environment } from '../../../environments/environment';
import { UsersModel } from '../../stubs/stub-users.service';

describe('UserResolverService', () => {
  let mockHttp: AuthHttp;

  beforeEach(() => {
    mockHttp = { get: null, post: null, put: null } as AuthHttp;

    spyOn(mockHttp, 'get').and.returnValue(Observable.of({
      json: () => UsersModel
    }));
    spyOn(mockHttp, 'post').and.returnValue(Observable.of({
      json: () => UsersModel[0]
    }));
    spyOn(mockHttp, 'put').and.returnValue(Observable.of({
      json: () => UsersModel[1]
    }));

    TestBed.configureTestingModule({
      providers: [
        UserResolverService,
        { provide: AuthHttp, useValue: mockHttp }
      ]
    });
  });

  it('should ...', inject([UserResolverService], (service: UserResolverService) => {
    expect(service).toBeTruthy();
  }));

  it('should get the user by its identifier', inject([UserResolverService], (service: UserResolverService) => {
    const id = '1';
    service.getById(id).then(res => {
      expect(mockHttp.get).toHaveBeenCalledWith(
        environment.apiUrlBase + '/users/' + id);
    });
  }));
});
