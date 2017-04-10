/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CoreModule } from '../../core/core.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { TESTING_PROVIDERS } from '../../../testing-providers';
import { AuthorizationService } from '../authorization.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let event: Event;

  beforeEach(async(() => {
    event = new Event('click');

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule
      ],
      declarations: [],
      providers: [TESTING_PROVIDERS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call api to reinit password', () => {
    const authorizationService = TestBed.get(AuthorizationService) as AuthorizationService;
    authorizationService.reinitPassword = jasmine.createSpy('reinitPassword');

    component.form.setValue({ email: '' }, { onlySelf: true });
    component.resetPassword(event);
    expect(authorizationService.reinitPassword).not.toHaveBeenCalled();
    expect(component.formSubmitted).toBeTruthy();
  });

  it('should reinit password and redirect to login', () => {
    const mockRouter = TestBed.get(Router) as Router;
    mockRouter.navigate = jasmine.createSpy('navigate');

    const authorizationService = TestBed.get(AuthorizationService) as AuthorizationService;
    authorizationService.reinitPassword = jasmine.createSpy('reinitPassword').and.returnValue(Observable.of(true));

    component.form.setValue({ email: 'test@test.com' }, { onlySelf: true });
    component.resetPassword(event);

    expect(authorizationService.reinitPassword).toHaveBeenCalledWith('test@test.com');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.formSubmitted).toBeTruthy();
  });
});
