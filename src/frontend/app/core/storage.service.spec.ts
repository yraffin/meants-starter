/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StorageService } from './storage.service';

const DATA = { user: 'test'};
const KEY = 'key';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
  });

  it('should ...', inject([StorageService], (service: StorageService) => {
    expect(service).toBeTruthy();
  }));

  it('should create/read/remove item from storage...', inject([StorageService], (service: StorageService) => {
    service.setItem(KEY, DATA);
    expect(service.getItem(KEY)).toEqual(DATA);
    service.removeItem(KEY);
    expect(service.getItem(KEY)).toBeNull();
  }));

  it('should clear storage...', inject([StorageService], (service: StorageService) => {
    service.setItem(KEY, DATA);
    expect(service.getItem(KEY)).toEqual(DATA);
    service.clear();
    expect(service.getItem(KEY)).toBeNull();
  }));
});
