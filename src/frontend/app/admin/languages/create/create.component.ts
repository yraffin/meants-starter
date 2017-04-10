import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LanguageModel } from '../language-model';
import { LanguagesService } from '../languages.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  /** Gets or sets the language model @property {LanguageModel} */
  language: LanguageModel;

  /**
   * Initializes a new instance of the CreateComponent class.
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

  ngOnInit() {
  }

  onLanguageSubmitted(data: LanguageModel) {
    this.service.create(data).subscribe((response) => {
      this.language = response;
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
