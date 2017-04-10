import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { LanguageModel } from '../language-model';
import { ResourceModel } from '../resource-model';
import { LanguagesService } from '../languages.service';
import { environment } from '../../../../environments/environment';
import { BaseListComponent, ListFormParams } from '../../../core/base-list-component';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent extends BaseListComponent<ResourceModel> implements OnInit, OnDestroy {

  /** Gets or sets the language identifier @property {string} */
  languageId: string;

  /** Gets or sets the language model @property {LanguageModel} */
  language: LanguageModel;

  /** Gets or sets the route subscription @property {Subscription} */
  routeSub: Subscription;

  /** Gets or sets the filters form group. @property {FormGroup} */
  filterForm: FormGroup;

  /** Gets or sets the edition form group. @property {FormGroup} */
  editForm: FormGroup;

  /** Gets or sets the current edit action. @property {string} */
  action: string;

  /** Gets or sets a value indicating whether edit form is submitted. @property {boolean} */
  isSubmitted = false;

  /** Gets or sets the child edit modal. @property {any} */
  @ViewChild('editModal') public editModal: any;

  editModalRef: NgbModalRef;

  /**
   * Initializes a new instance of the ResourcesComponent.
   * @constructor
   * @param {ActivatedRoute} route The current activated route.
   * @param {Router} router The angular router service.
   * @param {LanguagesService} service The application languages service.
   * @param {FormBuilder} formBuilder The angular form builder.
   * @param {NgbModal} modalService The bootstrap modal service.
   * @param {TranslateService} translateService The angular translate service.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: LanguagesService,
    formBuilder: FormBuilder,
    private modalService: NgbModal,
    private translateService: TranslateService
  ) {
    super(formBuilder);
  }

  /**
   * Executed on component initializes.
   * @method
   */
  ngOnInit() {
    this.sorts.push({ column: 'key', direction: 'asc' });
    super.ngOnInit();
    this.initEditForm();

    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.languageId = params['id'];
      if (this.languageId === '') {
        this.language = undefined;
        return;
      }

      this.service.getById(this.languageId).subscribe(data => this.language = data);
      this.initTable();
    });
  }

  /**
   * Executed on component destroy.
   * @method
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  /**
   * Initializes the list table.
   * @method
   */
  initTable() {
    if (!this.languageId || this.languageId.replace(/ /ig, '') === ''){
      return;
    }

    super.initTable();
  }

  /**
   * Gets all the element for a page.
   * @method
   * @param {ListFormParams} parameters The current search parameters.
   * @returns {Observable<TEntity[]>}
   */
  getAll(parameters?: ListFormParams){
    return this.service.allResources(this.languageId, parameters);
  }

  /**
   * Gets the total number of element.
   * @method
   * @param {string} search The searching terms.
   * @returns {Observable<TotalModel>}
   */
  getTotal(search?: string){
    return this.service.allResourcesCount(this.languageId, search);
  }

  /**
   * Initializes the component edition formular.
   * @method
   */
  initEditForm() {
    // initialize the edit form.
    this.editForm = this.formBuilder.group({
      id: '',
      key: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  /**
   * Add a new resource to the language.
   * @method
   * @param {Event} event The current submit event.
   */
  addNew(event: Event) {
    this.editResource(event, { id: '', key: '', value: '' });
  }

  /**
   * Edit a resource to the language.
   * @method
   * @param {Event} event The current submit event.
   * @param {ResourceModel} resource The resource model to edit.
   */
  editResource(event: Event, resource: ResourceModel) {
    event.preventDefault();
    this.action = !!resource.id ? 'edit' : 'create';
    this.editForm.setValue(resource, { onlySelf: true });
    this.showEditModal();
  }

  /**
   * Save the editing resource.
   * @method
   * @param {Event} event The current submit event.
   */
  saveResource(event: Event) {
    event.preventDefault();
    this.isSubmitted = true;
    if (!this.editForm.valid) {
      return;
    }

    const isNew = !this.editForm.value.id;
    const result = !isNew ? this.service.updateResource(this.languageId, this.editForm.value)
      : this.service.createResource(this.languageId, this.editForm.value);

    result.subscribe(data => {
      this.initTable();
      this.hideEditModal();

      const lang = this.translateService.currentLang;
      this.translateService.getTranslation(lang)
        .subscribe(() => {
          this.translateService.onLangChange.emit({ lang: lang, translations: result });
        });
    });
  }

  /**
   * Show the edition modal.
   * @method
   */
  public showEditModal(): void {
    this.isSubmitted = false;
    this.editModalRef = this.modalService.open(this.editModal)
    this.editModalRef.result.then((result) => {
      // save result
    }, (reason) => {
      // not saving
    });
  }

  /**
   * Hide the edition modal.
   * @method
   */
  public hideEditModal(): void {
    this.isSubmitted = false;
    this.editModalRef.close();
  }

  /**
   * Delete a language resource.
   * @method
   * @param {Event} event The current click event.
   * @param {string} id The language resource identifier.
   */
  deleteResource(event: Event, id: string) {
    event.preventDefault();
    this.service.removeResource(this.languageId, id)
      .subscribe(data => this.initTable());
  }

}
