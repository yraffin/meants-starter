import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthorizationService } from './authorization.service';
import { authorizationHttpFactory } from './authorization-http';
import { HasRightDirective } from './has-right.directive';
import { USERS_GUARD_PROVIDERS } from './guards';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    HasRightDirective,
    LoginComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    ForbiddenComponent
  ],
  exports: [
    LoginComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    ForbiddenComponent,
    HasRightDirective
  ]
})
export class AuthenticationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthenticationModule,
      providers: [
        AuthorizationService,
        USERS_GUARD_PROVIDERS,
        {
          provide: AuthHttp,
          useFactory: authorizationHttpFactory,
          deps: [AuthorizationService, Http]
        }]
    };
  };
}
