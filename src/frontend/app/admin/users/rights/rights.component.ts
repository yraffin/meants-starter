import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { UsersService } from '../users.service';

/**
 * Represents the user rights components.
 * @class
 */
@Component({
  selector: 'app-rights',
  templateUrl: './rights.component.html',
  styleUrls: ['./rights.component.scss']
})
export class RightsComponent implements OnInit {

  /** Represents the available rights @property {any} */
  rights: any;

  /** Represents the user rights @property {string[]} */
  userRights = [] as string[];

  /** Gets or sets the route subscription @property {Subscription} */
  routeSub: Subscription;

  /** Gets or sets the user identifier. @property {string} */
  userId: string;

  /**
   * Initializes a new instance of the RightsComponent class.
   * @constructor
   * @param {ActivatedRoute} route The current activated route.
   * @param {Router} router The angular router service.
   * @param {ToastrService} toastr The angular toastr service.
   * @param {TranslateService} translateService The angular translate service.
   * @param {UsersService} service The application users service.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private service: UsersService
  ) { }

  ngOnInit() {
    this.service.allRights().subscribe(data => this.rights = data);

    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.userId = params['id'];
      if (!this.userId || this.userId === '') {
        this.userId = undefined;
        this.userRights = [];
        return;
      }

      this.service.userRights(this.userId).subscribe(data => this.userRights = data);
    });
  }

  /**
   * Gets a value indicating whether user has the requested right.
   * @method
   * @param {string} right The requested right.
   * @returns {boolean}
   */
  hasRight(right: string) {
    return this.userRights.indexOf(right) > -1;
  }

  /**
   * Add or remove a right to the user.
   * @method
   * @param {string} right The requested right.
   */
  toggleRight(right: string) {
    const index = this.userRights.indexOf(right);
    if (index === -1) {
      this.userRights.push(right);
      return;
    }

    this.userRights.splice(index, 1);
  }

  /**
   * Update the list of user rights
   * @method
   */
  save() {
    this.service.updateRights(this.userId, this.userRights).subscribe(data => {
      this.toastr.success(this.translateService.instant('users.rights.save.success'));
      this.goBack();
    })
  }

  /**
   * Go back to previous route.
   * @method
   * @param {Event} event The current click event.
   */
  goBack(event?: Event) {
    if (!!event) {
      event.preventDefault();
    }

    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
