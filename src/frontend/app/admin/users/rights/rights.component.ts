import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthorizationService } from '../../../authentication/authorization.service';
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
export class RightsComponent implements OnInit, OnDestroy {

  /** Represents the available rights @property {any} */
  rights: any;

  /** Represents the user rights @property {string[]} */
  userRights = [] as string[];

  /** Gets or sets the route subscription @property {Subscription} */
  routeSub: Subscription;

  /** Gets or sets the route data subscription @property {Subscription} */
  routeDataSub: Subscription;

  /** Gets or sets the user identifier. @property {string} */
  userId: string;

  /** Gets or sets the username. @property {string} */
  username: string;

  /**
   * Initializes a new instance of the RightsComponent class.
   * @constructor
   * @param {ActivatedRoute} route The current activated route.
   * @param {Router} router The angular router service.
   * @param {ToastrService} toastr The angular toastr service.
   * @param {TranslateService} translateService The angular translate service.
   * @param {UsersService} service The application users service.
   * @param {AuthorizationService} authorizationService The application authorization service.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private service: UsersService,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit() {
    this.service.allRights().subscribe(data => this.rights = data);

    this.routeDataSub = this.route.data.subscribe((data: any) => {
      this.username = data.username;
    });

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
   * Occurred on component destroy.
   * @method
   */
  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }

    if (this.routeDataSub) {
      this.routeDataSub.unsubscribe();
    }
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
      if (this.username === this.authorizationService.authInfo.username) {
        this.refreshUserRights();
      }

      this.goBack();
    })
  }

  /**
   * Refresh the current user rights.
   * @method
   */
  refreshUserRights() {
    this.service.userRights(this.userId).subscribe(rights => this.authorizationService.rights = rights);
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
