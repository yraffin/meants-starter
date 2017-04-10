import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserModel } from '../user-model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  /** Gets or sets the user model @property {UserModel} */
  user: UserModel;

  /** Gets or sets the route subscription @property {Subscription} */
  routeSub: Subscription;

  /**
   * Initializes a new instance of the EditComponent class.
   * @constructor
   * @param {ActivatedRoute} route The current activated route.
   * @param {Router} router The angular router service.
   * @param {UsersService} service The application user service.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: UsersService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: Params) => {
      const userId = params['id'];
      if (userId === '') {
        this.user = undefined;
        return;
      }

      this.service.getById(userId).subscribe(data => this.user = data);
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
   * Executed on user submitted.
   * @method
   * @param {UserModel} data The changed user model to save.
   */
  onUserSubmitted(data: UserModel) {
    this.service.update(data).subscribe((response) => {
      this.user = response;
      this.goBack();
    });
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
