import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import * as _ from 'underscore';
import { Subscription } from 'rxjs/Subscription';

import { AuthorizationService } from './authorization.service';

/**
 * Represents the has right directive.
 * @class
 */
@Directive({
  selector: '[appHasRight]'
})
export class HasRightDirective implements OnDestroy {

  /** Respresents the required rights @property {string[]} */
  private rights: string[];

  /** Represents the rights changed Subscription */
  private rightsChangedSubscription: Subscription;

  /** Represents the business rights needed to show template. @property {string | string[]} */
  @Input() appHasRight: string | string[];

  /**
   * Initializes a new instance of the HasRightDirective class.
   * @constructor
   * @param {TemplateRef<any>} templateRef The directive template structural reference.
   * @param {ViewContainerRef} viewContainerRef The directive view container structural reference.
   * @param {AuthorizationService} authorizationService The application authorization service.
   */
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) {
    this.rightsChangedSubscription = this.authorizationService.getRightsChangedEmitter()
      .subscribe(() => this.updateView());
  }

  /**
   * Occurred when directive is destroyed.
   * @method
   */
  ngOnDestroy() {
    this.rightsChangedSubscription.unsubscribe();
  }

  /**
   * Execute when component input changes.
   * @method
   * @param {SimpleChanges} changes The list of changed input.
   */
  ngOnChanges(changes: SimpleChanges) {
    this.rights = [];
    if (!changes.appHasRight || changes.appHasRight.currentValue === changes.appHasRight.previousValue) {
      return;
    }

    this.rights = _.isArray(changes.appHasRight.currentValue) ?
      changes.appHasRight.currentValue :
      [changes.appHasRight.currentValue];

    this.updateView();
  }

  /**
   * Update the view.
   * @method
   */
  updateView() {
    this.viewContainerRef.clear();
    if (_.some(this.rights, (right) => _.contains(this.authorizationService.rights, right))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
