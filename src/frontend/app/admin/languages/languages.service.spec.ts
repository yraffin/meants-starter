/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Headers, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { LanguagesService } from './languages.service';
import { TESTING_PROVIDERS, TESTING_IMPORTS } from '../../../testing-providers';
import { environment } from '../../../environments/environment';
import { LanguagesModel } from '../../stubs/stub-languages.service';

describe('LanguagesService', () => {
  let mockHttp: AuthHttp;

  beforeEach(() => {
    mockHttp = { get: null, post: null, put: null } as AuthHttp;

    spyOn(mockHttp, 'get').and.returnValue(Observable.of({
      json: () => LanguagesModel
    }));
    spyOn(mockHttp, 'post').and.returnValue(Observable.of({
      json: () => LanguagesModel[0]
    }));
    spyOn(mockHttp, 'put').and.returnValue(Observable.of({
      json: () => LanguagesModel[1]
    }));

    TestBed.configureTestingModule({
      providers: [
        LanguagesService,
        { provide: AuthHttp, useValue: mockHttp }
      ]
    });
  });

  it('should ...', inject([LanguagesService], (service: LanguagesService) => {
    expect(service).toBeTruthy();
  }));

  it('should get the languages list', inject([LanguagesService], (service: LanguagesService) => {
    const params = { page: 1, limit: 10, sort: 'languagename:asc' };
    const urlParams = new URLSearchParams();
    urlParams.set('sort', params.sort);
    urlParams.set('page', params.page.toString());
    urlParams.set('limit', params.limit.toString());
    service.all(params).subscribe(res => {
      expect(mockHttp.get).toHaveBeenCalledWith(
        environment.apiUrlBase + 'languages', { search: urlParams });
      expect(res).toEqual(LanguagesModel);
    });
  }));

  it('should get the languages list count', inject([LanguagesService], (service: LanguagesService) => {
    const params = { search: 'toto', page: 1, limit: 10, sort: 'languagename:asc' };
    const urlParams = new URLSearchParams();
    urlParams.set('sort', params.sort);
    urlParams.set('search', params.search);
    urlParams.set('page', params.page.toString());
    urlParams.set('limit', params.limit.toString());
    service.allCount().subscribe(res => {
      expect(mockHttp.get).toHaveBeenCalledWith(
        environment.apiUrlBase + 'languages/count', { search: urlParams });
      expect(res).toEqual(LanguagesModel);
    });
  }));

  it('should get the language by its identifier', inject([LanguagesService], (service: LanguagesService) => {
    const id = '1';
    service.getById(id).subscribe(res => {
      expect(mockHttp.get).toHaveBeenCalledWith(
        environment.apiUrlBase + 'languages/' + id);
    });
  }));

  it('should create the language', inject([LanguagesService], (service: LanguagesService) => {
    const id = 1;
    service.create(LanguagesModel[0]).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalled();
      expect(res).toEqual(LanguagesModel[0]);
    });
  }));

  it('should put the language', inject([LanguagesService], (service: LanguagesService) => {
    const id = 1;
    service.update(LanguagesModel[1]).subscribe(res => {
      expect(mockHttp.put).toHaveBeenCalled();
      expect(res).toEqual(LanguagesModel[1]);
    });
  }));
});
