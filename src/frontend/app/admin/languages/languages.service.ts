import { Injectable } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { ListFilterParams } from '../../shared/models/list-filter-params';
import { LanguageModel } from './language-model';
import { ResourceModel } from './resource-model';
import { CultureModel } from './culture-model';

/**
 * Represents the language list filter.
 * @class
 */
export class LanguageFilter extends ListFilterParams {
  search?: string;
}

/**
 * Represents the languages service.
 * @class
 */
@Injectable()
export class LanguagesService {
  /** POST/PUT headers */
  private headers = new Headers({ 'Content-Type': 'application/json' });

  /** Gets the base api url @property {string} */
  private baseUrl = environment.apiUrlBase;

  /**
   * Initializes a new instance of the LanguagesService.
   * @constructor
   * @param {AuthHttp} http The authorized http service.
   */
  constructor(private http: AuthHttp) { }

  /**
   * Gets the language list url params.
   * @method
   * @param {LanguageFilter} parameters The page filter parameters.
   * @returns {URLSearchParams}
   */
  getUrlParams(parameters: LanguageFilter) {
    const params = new URLSearchParams();
    if ((parameters.search || '') !== '') {
      params.set('search', parameters.search);
    }
    if ((parameters.sort || '') !== '') {
      params.set('sort', parameters.sort);
    }
    params.set('page', parameters.page.toString());
    params.set('limit', parameters.limit.toString());
    return params;
  }

  /**
   * Gets all cultures.
   * @method
   * @return {Observable<CultureModel[]>}
   */
  cultures() {
    return this.http.get(`${this.baseUrl}languages/cultures`).map(response => response.json() as CultureModel[]);
  }

  /**
   * Gets all languages with pagination.
   * @method
   * @param {LanguageFilter} parameters The page filter parameters.
   * @return {Observable<LanguageModel[]>}
   */
  all(parameters: LanguageFilter) {
    const params = this.getUrlParams(parameters);
    return this.http.get(`${this.baseUrl}languages`, { search: params }).map(response => response.json() as LanguageModel[]);
  }

  /**
   * Gets the number of languages.
   * @method
   * @return {Observable<{ count: number }>}
   */
  allCount() {
    return this.http.get(`${this.baseUrl}languages/count`).map(response => response.json());
  }

  /**
   * Gets the language model by its identifier.
   * @method
   * @param {string} languageId The requested language identifier.
   * @returns {Observable<LanguageModel>}
   */
  getById(languageId: string) {
    return this.http.get(`${this.baseUrl}languages/${languageId}`).map(response => response.json() as LanguageModel);
  }

  /**
   * Create a new language.
   * @method
   * @param {LanguageModel} data The language model to create.
   * @return {Observable<LanguageModel>}
   */
  create(data: LanguageModel) {
    delete data.id;
    return this.http.post(`${this.baseUrl}languages`, JSON.stringify(data), { headers: this.headers })
      .map(response => response.json() as LanguageModel);
  }

  /**
   * Update an existing language.
   * @method
   * @param {LanguageModel} data The language model to update.
   * @return {Observable<LanguageModel>}
   */
  update(data: LanguageModel) {
    const id = data.id;
    return this.http.put(`${this.baseUrl}languages/${id}`, JSON.stringify(data), { headers: this.headers })
      .map(response => response.json() as LanguageModel);
  }

  /**
   * Remove a language.
   * @method
   * @param {string} id The language identifier to remove.
   */
  remove(id: string) {
    return this.http.delete(`${this.baseUrl}languages/${id}`, { headers: this.headers })
      .map(response => response.json());
  }

  /**
   * Gets all languages resources with pagination.
   * @method
   * @param {string} langId The current language identifier.
   * @param {LanguageFilter} parameters The page filter parameters.
   * @return {Observable<ResourceModel[]>}
   */
  allResources(langId: string, parameters: LanguageFilter) {
    const params = this.getUrlParams(parameters);
    return this.http.get(`${this.baseUrl}languages/${langId}/resources`, { search: params })
        .map(response => response.json() as ResourceModel[]);
  }

  /**
   * Gets the number of languages resources.
   * @method
   * @param {string} langId The current language identifier.
   * @param {string} search The searching terms.
   * @return {Observable<{ count: number }>}
   */
  allResourcesCount(langId: string, search: string) {
    const params = new URLSearchParams();
    if ((search || '') !== '') {
      params.set('search', search);
    }

    return this.http.get(`${this.baseUrl}languages/${langId}/resources/count`, { search: params })
      .map(response => response.json() as { count: number });
  }

  /**
   * Create a new languages resource.
   * @method
   * @param {string} langId The current language identifier.
   * @param {ResourceModel} data The languages resource model to create.
   * @return {Observable<ResourceModel>}
   */
  createResource(langId: string, data: ResourceModel) {
    delete data.id;
    return this.http.post(`${this.baseUrl}languages/${langId}/resources`, JSON.stringify(data), { headers: this.headers })
      .map(response => response.json() as ResourceModel);
  }

  /**
   * Update an existing languages resource.
   * @method
   * @param {string} langId The current language identifier.
   * @param {ResourceModel} data The languages resource model to update.
   * @return {Observable<ResourceModel>}
   */
  updateResource(langId: string, data: ResourceModel) {
    const id = data.id;
    return this.http.put(`${this.baseUrl}languages/${langId}/resources/${id}`, JSON.stringify(data), { headers: this.headers })
      .map(response => response.json() as ResourceModel);
  }

  /**
   * Remove a language resource.
   * @method
   * @param {string} langId The current language identifier.
   * @param {string} id The language identifier to remove.
   */
  removeResource(langId: string, id: string) {
    return this.http.delete(`${this.baseUrl}languages/${langId}/resources/${id}`, { headers: this.headers })
      .map(response => response.json());
  }
}
