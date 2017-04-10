/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Headers, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { UsersService } from './users.service';
import { TESTING_PROVIDERS, TESTING_IMPORTS } from '../../../testing-providers';
import { environment } from '../../../environments/environment';
import { UsersModel } from '../../stubs/stub-users.service';

describe('UsersService', () => {
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
        UsersService,
        { provide: AuthHttp, useValue: mockHttp }
      ]
    });
  });

  it('should ...', inject([UsersService], (service: UsersService) => {
    expect(service).toBeTruthy();
  }));

  it('should get the users list', inject([UsersService], (service: UsersService) => {
    const params = { page: 1, limit: 10, sort: 'username:asc' };
    const urlParams = new URLSearchParams();
    urlParams.set('sort', params.sort);
    urlParams.set('page', params.page.toString());
    urlParams.set('limit', params.limit.toString());
    service.all(params).subscribe(res => {
      expect(mockHttp.get).toHaveBeenCalledWith(
        environment.apiUrlBase + 'users', { search: urlParams });
      expect(res).toEqual(UsersModel);
    });
  }));

  it('should get the users list count', inject([UsersService], (service: UsersService) => {
    const params = { search: 'toto', page: 1, limit: 10, sort: 'username:asc' };
    const urlParams = new URLSearchParams();
    urlParams.set('sort', params.sort);
    urlParams.set('search', params.search);
    urlParams.set('page', params.page.toString());
    urlParams.set('limit', params.limit.toString());
    service.allCount(params).subscribe(res => {
      expect(mockHttp.get).toHaveBeenCalledWith(
        environment.apiUrlBase + 'users/count', { search: urlParams });
      expect(res).toEqual(UsersModel);
    });
  }));

  it('should get the user by its identifier', inject([UsersService], (service: UsersService) => {
    const id = '1';
    service.getById(id).subscribe(res => {
      expect(mockHttp.get).toHaveBeenCalledWith(
        environment.apiUrlBase + 'users/' + id);
    });
  }));

  it('should create the user', inject([UsersService], (service: UsersService) => {
    const id = 1;
    service.create(UsersModel[0]).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalled();
      expect(res).toEqual(UsersModel[0]);
    });
  }));

  it('should put the user', inject([UsersService], (service: UsersService) => {
    const id = 1;
    service.update(UsersModel[1]).subscribe(res => {
      expect(mockHttp.put).toHaveBeenCalled();
      expect(res).toEqual(UsersModel[1]);
    });
  }));
});
