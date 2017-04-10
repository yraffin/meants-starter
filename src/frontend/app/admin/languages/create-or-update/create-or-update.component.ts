import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LanguagesService } from '../languages.service';
import { LanguageModel } from '../language-model';
import { CultureModel } from '../culture-model';

@Component({
  selector: 'app-create-or-update',
  templateUrl: './create-or-update.component.html',
  styleUrls: ['./create-or-update.component.scss']
})
export class CreateOrUpdateComponent implements OnChanges {

  /** Gets or sets the language model @property {number} */
  @Input() language: LanguageModel;

  /** Gets or sets the language submitted event @property {number} */
  @Output() languageSubmitted = new EventEmitter();

  /** Gets or sets the filters form group. @property {FormGroup} */
  form: FormGroup;

  /** Gets or sets a value indicating whether form is submitted @property {boolean} */
  isSubmitted = false;

  /** Gets or sets the cultures list. @property {CultureModel[]} */
  cultures = [] as CultureModel[];

  /**
   * Gets the current edition action
   * @readonly
   * @property {string}
   */
  get action() {
    return this.language && this.language.id !== '' ? 'edit' : 'create';
  }

  /**
   * Initializes a new instance of the CreateOrUpdateComponent.
   * @constructor
   * @param {FormBuilder} formBuilder The angular form builder.
   * @param {LanguagesService} languagesService The application language service.
   */
  constructor(
    private formBuilder: FormBuilder,
    private service: LanguagesService
  ) {
    this.initialize();
  }

  /**
   * Execute when component is initialized.
   * @method
   */
  initialize() {
    this.form = this.formBuilder.group({
      id: 0,
      name: ['', Validators.required],
      flag: ['', Validators.required],
      culture: ['', Validators.required]
    });

    this.service.cultures().subscribe(data => this.cultures = data);
  }

  /**
   * Execute when component input changes.
   * @method
   * @param {SimpleChanges} changes The list of changed input.
   */
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    if (!this.language) {
      return;
    }

    this.form.setValue(this.language, { onlySelf: true });
  }

  /**
   * Execute when language click on submit button.
   * @method
   * @param {Event} event The current click event.
   */
  save(event: Event) {
    event.preventDefault();
    this.isSubmitted = true;
    if (!this.form.valid) {
      return;
    }

    this.languageSubmitted.emit(this.form.value);
  }

}
