import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { StorageService } from '../core/storage.service';
import { environment } from '../../environments/environment';
import { AuthModel, UserModel, LoginModel } from './models';
import { userRightsKey } from '../core/base-rights-guard';

const authKey = 'app.ath';
const options = { headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }) };

/**
 * Represents the authorization service.
 * @class
 */
@Injectable()
export class AuthorizationService {
  /** The jwt helper @property {JwtHelper} */
  private jwtHelper: JwtHelper;

  /** The rights changed event emitter @property {EventEmitter<void>} */
  private rightsChanged: EventEmitter<void> = new EventEmitter<void>();

  /** The redirect url. @property {string} */
  redirectUrl: string;

  /**
   * Initializes a new instance of the AuthorizationService class.
   * @param {StorageService} storage The application storage service.
   * @param {Http} http The angular http service.
   */
  constructor(
    private storage: StorageService,
    private http: Http
  ) {
    this.jwtHelper = new JwtHelper();
  }

  /**
   * Gets the current user authorization informations.
   * @property
   */
  get authInfo(): AuthModel {
    return this.storage.getItem<AuthModel>(authKey);
  }

  /**
   * Sets the current user authorization informations.
   * @property
   */
  set authInfo(value: AuthModel) {
    this.storage.setItem<AuthModel>(authKey, value);
  }

  /**
   * Gets the current user token.
   * @readonly
   * @property
   */
  get token(): string {
    return this.authInfo && this.authInfo.token;
  }

  /**
   * Gets the current user rights.
   * @property {string[]}
   */
  get rights(): string[] {
    return this.storage.getItem<string[]>(userRightsKey) || [];
  }

  /**
   * Sets the current user rights.
   * @property {string[]}
   */
  set rights(value: string[]) {
    this.storage.setItem<string[]>(userRightsKey, value);

    // emit event for rights changed.
    this.rightsChanged.emit();
  }

  /**
   * Gets a value indicating whether user is logged in.
   * @method
   * @return {boolean} Value indicating whether user is logged in.
   */
  loggedIn() {
    const isLoggedIn = tokenNotExpired(null, this.token);
    if (!isLoggedIn) {
      this.rights = null;
    }

    return isLoggedIn;
  }

  /**
   * Log the user in.
   * @method
   * @param {LoginModel} credentials The current user login model.
   * @return {Observable<boolean>} Value indicating whether user is logged.
   */
  login(credentials: LoginModel): Observable<boolean> {
    return this.http.post('auth', JSON.stringify(credentials), options)
      .map((response: Response) => {
        const data = response.json();

        if (!data || !data.token) {
          return false;
        }

        this.authInfo = {
          username: data.username,
          token: data.token,
          refresh: data.refresh
        };

        this.rights = data.rights || [];

        return true;
      });
  }

  /**
   * Log the user in.
   * @method
   * @param {LoginModel} credentials The current user login model.
   * @return {Observable<boolean>} Value indicating whether user is logged.
   */
  register(credentials: LoginModel): Observable<boolean> {
    return this.http.post('auth', JSON.stringify(credentials), options)
      .map((response: Response) => {
        const data = response.json();

        if (!data || !data.token) {
          return false;
        }

        this.authInfo = {
          username: data.username,
          token: data.token,
          refresh: data.refresh
        };

        this.rights = data.rights || [];

        return true;
      });
  }

  /**
   * Refresh the user token.
   * @method
   * @return {Observable<boolean>} Value indicating whether user token is refreshed.
   */
  refresh(): Observable<boolean> {
    return this.http.post('token', JSON.stringify({ 'refresh': this.authInfo.refresh }), options)
      .map((response: Response) => {
        const data = response.json();
        if (!data || !data.token) {
          return false;
        }

        const authInfo = Object.assign({}, this.authInfo); // { ...this.authInfo };
        authInfo.token = data.token;
        authInfo.username = data.username;
        this.authInfo = authInfo;

        this.rights = data.rights || [];

        return true;
      });
  }

  /**
   * Reinitialize the user password.
   * @method
   * @param {string} username The username to reinit.
   * @return {Observable<boolean>} Value indicating whether user password is reinit.
   */
  reinitPassword(username: string): Observable<boolean> {
    console.log('[TODO]: Create reset password API call');
    const headersOptions = options;
    headersOptions.headers.append('Authorization', 'JWT ' + this.token);
    return Observable.of(true);
  }

  /**
   * Log the user out.
   * @method
   */
  logout() {
    // return this.http.post('logout', options)
    //   .map((response: Response) => {
    //     this.storage.setItem(authKey, null);
    //     this.rights = null;
    //     return true;
    //   });

    this.storage.setItem(authKey, null);
    this.rights = null;
    return Observable.of(true);
  }

  /**
   * Gets the rights changed event emitter.
   * @method
   * @returns {EventEmitter<void>}
   */
  getRightsChangedEmitter() {
    return this.rightsChanged;
  }
}
