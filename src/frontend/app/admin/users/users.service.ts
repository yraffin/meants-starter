import { Injectable } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { ListFilterParams } from '../../shared/models/list-filter-params';
import { UserModel } from './user-model';

/**
 * Represents the user list filter.
 * @class
 */
export class UserFilter extends ListFilterParams {
  search?: string;
}

/**
 * Represents the users service.
 * @class
 */
@Injectable()
export class UsersService {
  /** POST/PUT headers */
  private headers = new Headers({ 'Content-Type': 'application/json' });

  /** Gets the base api url @property {string} */
  private baseUrl = environment.apiUrlBase;

  /**
   * Initializes a new instance of the UsersService.
   * @constructor
   * @param {AuthHttp} http The authorized http service.
   */
  constructor(private http: AuthHttp) { }

  /**
   * Gets the user list url params.
   * @method
   * @param {UserFilter} parameters The page filter parameters.
   * @returns {URLSearchParams}
   */
  getUrlParams(parameters: UserFilter) {
    const params = new URLSearchParams();
    if ((parameters.sort || '') !== '') {
      params.set('sort', parameters.sort);
    }
    if ((parameters.search || '') !== '') {
      params.set('search', parameters.search);
    }
    params.set('page', parameters.page.toString());
    params.set('limit', parameters.limit.toString());
    return params;
  }

  /**
   * Gets all users with pagination.
   * @method
   * @param {UserFilter} parameters The page filter parameters.
   * @return {Observable<UserModel[]>}
   */
  all(parameters: UserFilter) {
    const params = this.getUrlParams(parameters);
    return this.http.get(`${this.baseUrl}users`, { search: params }).map(response => response.json() as UserModel[]);
  }

  /**
   * Gets all users with pagination.
   * @method
   * @param {string} search The searching terms.
   * @return {Observable<{ count: number }>}
   */
  allCount(search: string) {
    const params = new URLSearchParams();
    if ((search || '') !== '') {
      params.set('search', search);
    }

    return this.http.get(`${this.baseUrl}users/count`, { search: params }).map(response => response.json());
  }

  /**
   * Gets the user model by its identifier.
   * @method
   * @param {string} userId The requested user identifier.
   * @returns {Observable<UserModel>}
   */
  getById(userId: string) {
    return this.http.get(`${this.baseUrl}users/${userId}`).map(response => response.json() as UserModel);
  }

  /**
   * Create a new user.
   * @method
   * @param {UserModel} data The user model to create.
   * @return {Observable<UserModel>}
   */
  create(data: UserModel) {
    return this.http.post(`${this.baseUrl}users`, JSON.stringify(data), { headers: this.headers })
      .map(response => response.json() as UserModel);
  }

  /**
   * Update an existing user.
   * @method
   * @param {UserModel} data The user model to update.
   * @return {Observable<UserModel>}
   */
  update(data: UserModel) {
    const id = data.id;
    return this.http.put(`${this.baseUrl}users/${id}`, JSON.stringify(data), { headers: this.headers })
      .map(response => response.json() as UserModel);
  }

  /**
   * Remove a user.
   * @method
   * @param {string} id The user identifier to remove.
   */
  remove(id: string) {
    return this.http.delete(`${this.baseUrl}users/${id}`, { headers: this.headers })
      .map(response => response.json());
  }

  /**
   * Gets all rights.
   * @method
   * @returns {Observable<any>}
   */
  allRights() {
    return this.http.get(`${this.baseUrl}users/rights`, { headers: this.headers })
      .map(response => response.json());
  }

  /**
   * Gets user rights.
   * @method
   * @returns {Observable<string[]>}
   */
  userRights(id: string) {
    return this.http.get(`${this.baseUrl}users/${id}/rights`, { headers: this.headers })
      .map(response => response.json() as string[]);
  }

  /**
   * Gets user rights.
   * @method
   * @param {string} id The current user identifier.
   * @param {string[]} data The current user rights.
   * @returns {Observable<string[]>}
   */
  updateRights(id: string, data: string[]) {
    return this.http.put(`${this.baseUrl}users/${id}/rights`, JSON.stringify(data), { headers: this.headers })
      .map(response => response.json() as string[]);
  }
}
