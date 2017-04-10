/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, ErrorHandler } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { CoreModule } from '../../core/core.module';
import { LoginComponent } from './login.component';
import { TESTING_PROVIDERS } from '../../../testing-providers';
import { StubTokenHelper } from '../../stubs/stub-token-helper';
import { AuthorizationService } from '../authorization.service';
import { AppErrorHandler } from './../../core/app-error-handler';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const email = 'yannick.raffin@modisfrance.fr';
  const password = 'mdp';
  let tokenHelper: StubTokenHelper;
  let event: Event;

  beforeEach(async(() => {
    tokenHelper = new StubTokenHelper();
    event = new Event('click');

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule,
      ],
      declarations: [],
      providers: [TESTING_PROVIDERS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call api to log user in', () => {
    const authorizationService = TestBed.get(AuthorizationService) as AuthorizationService;
    authorizationService.login = jasmine.createSpy('login');

    component.loginForm.setValue({ email: email, password: '' }, { onlySelf: true });
    component.login(event);
    expect(authorizationService.login).not.toHaveBeenCalled();
    expect(component.loginFormSubmitted).toBeTruthy();

    component.loginForm.setValue({ email: '', password: password }, { onlySelf: true });
    component.login(event);
    expect(authorizationService.login).not.toHaveBeenCalled();
    expect(component.loginFormSubmitted).toBeTruthy();
  });

  it('should call component login', () => {
    const authorizationService = TestBed.get(AuthorizationService) as AuthorizationService;
    authorizationService.login = jasmine.createSpy('login').and.returnValue(Observable.of(true));

    const mockRouter = TestBed.get(Router) as Router;
    mockRouter.navigate = jasmine.createSpy('navigate');

    component.loginForm.setValue({ email: email, password: password }, { onlySelf: true });
    component.login(event);
    expect(authorizationService.login).toHaveBeenCalledWith(email, password);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should log the user in and redirect to dashboard', () => {
    const mockHttp = TestBed.get(Http) as Http;
    const mockRouter = TestBed.get(Router) as Router;

    mockHttp.post = jasmine.createSpy('post').and.returnValue(Observable.of({
      json: () => tokenHelper.generateToken(email)
    }));

    mockRouter.navigate = jasmine.createSpy('navigate');

    component.loginForm.setValue({ email: email, password: password }, { onlySelf: true });
    component.login(event);

    expect(mockHttp.post).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('not redirect user when login failed', () => {
    const mockRouter = TestBed.get(Router) as Router;
    const authorizationService = TestBed.get(AuthorizationService) as AuthorizationService;
    const errorMsg = 'an error occurred while processing';

    authorizationService.login = jasmine.createSpy('login').and.returnValue(Observable.from(Promise.reject(errorMsg)));
    mockRouter.navigate = jasmine.createSpy('navigate');
    component.loginForm.setValue({ email: email, password: password }, { onlySelf: true });
    component.login(event);

    expect(authorizationService.login).toHaveBeenCalled();
    expect(component.loginFormSubmitted).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

});
