import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserModel } from '../user-model';
import { UserViewModel } from '../user-view-model';

const emailPattern = '^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*'
  + '\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}'
  + '\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$';


@Component({
  selector: 'app-create-or-update',
  templateUrl: './create-or-update.component.html',
  styleUrls: ['./create-or-update.component.scss']
})
export class CreateOrUpdateComponent implements OnChanges {

  /** Gets or sets the user model @property {number} */
  @Input() user: UserModel;

  /** Gets or sets the user submitted event @property {number} */
  @Output() userSubmitted = new EventEmitter();

  /** Gets or sets the filters form group. @property {FormGroup} */
  form: FormGroup;

  /** Gets or sets a value indicating whether form is submitted @property {boolean} */
  isSubmitted = false;

  /**
   * Gets the current edition action
   * @readonly
   * @property {string}
   */
  get action() {
    return this.user && this.user.id && this.user.id !== '' ? 'edit' : 'create';
  }

  /** Gets or sets a value indicating whether form is submitted @property {boolean} */
  civilities = [
    'core.users.civility.0',
    'core.users.civility.1',
    'core.users.civility.2'
  ];

  /**
   * Initializes a new instance of the CreateOrUpdateComponent.
   * @constructor
   * @param {FormBuilder} formBuilder The angular form builder.
   */
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.initialize();
  }

  /**
   * Execute when component is initialized.
   * @method
   */
  initialize() {
    this.form = this.formBuilder.group({
      id: '',
      civility: 0,
      isSystem: false,
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailPattern)])],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      passwordGroup: this.formBuilder.group(this.initPasswordGroup(), { validator: this.areEquals() })
    });

    // set civility to integer
    this.form.valueChanges.subscribe(data => data.civility = parseInt(data.civility, 10));
  }

  /**
   * Initialize password form group.
   * @method
   */
  initPasswordGroup() {
    // initialize bank model
    const model = {
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      passwordConfirm: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    };

    return model;
  }

  /**
   * Execute when component input changes.
   * @method
   * @param {SimpleChanges} changes The list of changed input.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.user || changes.user.currentValue === changes.user.previousValue) {
      return;
    }

    const group = this.form.controls.passwordGroup as FormGroup;

    // get the form model
    const viewModel = (this.user && this.user.id && this.user.id.length > 0) ?
      UserViewModel.fromModel(this.user) : new UserViewModel();

    this.form.setValue(viewModel, { emitEvent: true });

    // update user values
    if (!(this.user && this.user.id && this.user.id !== '')) {
      // update validation
      const validation = this.initPasswordGroup();
      Object.keys(group.controls).forEach(key => {
        group.controls[key].setValidators(validation[key][1]);
        group.controls[key].updateValueAndValidity();
      });
    } else {
      // update validation
      Object.keys(group.controls).forEach(key => {
        group.controls[key].setValidators(null);
        group.controls[key].updateValueAndValidity();
      });
    }
  }

  /**
   * Gets a value indicating whether specified fields are equals.
   * @method
   * @param {string[]} properties The properties to check.
   */
  areEquals(...properties: string[]) {
    return (group: FormGroup) => {
      const values = [];
      if (!properties || !properties.length) {
        properties = Object.keys(group.controls);
      }

      properties.forEach(property => {
        values.push(group.controls[property].value);
      });

      if (values.every((item: any, index: number, array: Array<any>) => item === array[0])) {
        return null;
      }

      return {
        areEquals: true
      };
    };
  }

  /**
   * Execute when user click on submit button.
   * @method
   * @param {Event} event The current click event.
   */
  save(event: Event) {
    event.preventDefault();
    this.isSubmitted = true;
    if (!this.form.valid) {
      return;
    }

    const model = UserViewModel.toModel(this.form.value);
    this.userSubmitted.emit(model);
  }

}
