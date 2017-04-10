import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { LanguagesService } from './languages.service';
import { LanguageModel } from './language-model';
import { environment } from '../../../environments/environment';
import { BaseListComponent, ListFormParams } from '../../core/base-list-component';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent extends BaseListComponent<LanguageModel> implements OnInit {

  /**
   * Initializes a new instance of the LanguagesComponent.
   * @constructor
   * @param {LanguagesService} languagesService The application languages service.
   * @param {FormBuilder} formBuilder The angular form builder.
   */
  constructor(
    private languagesService: LanguagesService,
    formBuilder: FormBuilder
  ) {
    super(formBuilder);
  }

  /**
   * Occurred when component initializes.
   * @method
   */
  ngOnInit() {
    this.searchEnabled = false;
    this.sorts.push({ column: 'name', direction: 'asc' });
    super.ngOnInit();
  }

  /**
   * Gets all the element for a page.
   * @method
   * @param {ListFormParams} parameters The current search parameters.
   * @returns {Observable<TEntity[]>}
   */
  getAll(parameters?: ListFormParams){
    return this.languagesService.all(parameters);
  }

  /**
   * Gets the total number of element.
   * @method
   * @param {string} search The searching terms.
   * @returns {Observable<TotalModel>}
   */
  getTotal(search?: string){
    return this.languagesService.allCount();
  }

  /**
   * Delete a language.
   * @method
   * @param {Event} event The current click event.
   * @param {string} id The language identifier.
   */
  deleteLanguage(event: Event, id: string) {
    event.preventDefault();
    this.languagesService.remove(id)
      .subscribe(data => this.initTable());
  }

}
