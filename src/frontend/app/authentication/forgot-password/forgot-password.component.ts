import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { StorageService } from '../../core/storage.service';
import { AuthorizationService } from '../authorization.service';
import { BaseTranslationComponent } from '../../core/base-translation-component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseTranslationComponent implements OnInit {

  /** Gets or sets the form group. @property {FormGroup} */
  form: FormGroup;

  /** Gets or sets a value indicating whether form is submitted. @property {boolean} */
  formSubmitted = false;

  /** Gets or sets a value indicating whether reset password failed. @property {boolean} */
  resetFailed = false;

  /**
   * Initializes a new instance of the ForgotPasswordComponent class.
   * @constructor
   * @param {Router} router The current router.
   * @param {FormBuilder} formBuilder The angular form builder.
   * @param {AuthorizationService} authorizationService The application authorization service.
   * @param {StorageService} storage The application storage service.
   * @param {TranslateService} translateService The angular translate service.
   */
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authorizationService: AuthorizationService,
    storage: StorageService,
    translateService: TranslateService
  ) {
    super(storage, translateService);
  }

  /**
   * Execute when component is initialized.
   * @method
   */
  ngOnInit() {
    const emailPattern = '^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*'
      + '\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}'
      + '\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$';
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailPattern)])]
    });
  }

  /**
   * Reset the user password.
   * @method
   * @param {Event} event The current click event.
   */
  resetPassword(event: Event) {
    this.formSubmitted = true;
    if (!this.form.valid) {
      return;
    }

    this.authorizationService.reinitPassword(this.form.value.email)
      .subscribe(() => this.router.navigate(['/login']));
  }

}
