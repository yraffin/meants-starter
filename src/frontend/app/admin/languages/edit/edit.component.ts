import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { LanguageModel } from '../language-model';
import { LanguagesService } from '../languages.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  /** Gets or sets the language model @property {LanguageModel} */
  language: LanguageModel;

  /** Gets or sets the route subscription @property {Subscription} */
  routeSub: Subscription;

  /**
   * Initializes a new instance of the EditComponent class.
   * @constructor
   * @param {ActivatedRoute} route The current activated route.
   * @param {Router} router The angular router service.
   * @param {LanguagesService} service The application language service.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: LanguagesService
  ) { }

  /**
   * Executed on component initializes.
   * @method
   */
  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: Params) => {
      const languageId = params['id'];
      if (!languageId || languageId.replace(/ /ig, '') === '') {
        this.language = undefined;
        return;
      }

      this.service.getById(languageId).subscribe(data => this.language = data);
    });
  }

  /**
   * Executed on component destroy.
   * @method
   */
  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  /**
   * Executed on language submitted.
   * @method
   * @param {LanguageModel} data The changed language model to save.
   */
  onLanguageSubmitted(data: LanguageModel) {
    console.log('language saved:', data);
    this.service.update(data).subscribe((response) => {
      this.language = response;
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
