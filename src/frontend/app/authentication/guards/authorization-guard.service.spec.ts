import { TestBed, inject } from '@angular/core/testing';

import { AuthorizationGuardService } from './authorization-guard.service';

describe('AuthorizationGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorizationGuardService]
    });
  });

  it('should ...', inject([AuthorizationGuardService], (service: AuthorizationGuardService) => {
    expect(service).toBeTruthy();
  }));
});
