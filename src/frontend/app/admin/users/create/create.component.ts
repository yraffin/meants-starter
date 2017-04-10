import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserModel } from '../user-model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  /** Gets or sets the user model @property {UserModel} */
  user: UserModel;

  /**
   * Initializes a new instance of the CreateComponent class.
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
    this.user = new UserModel();
  }

  onUserSubmitted(data: UserModel) {
    console.log('user saved:', data);
    this.service.create(data).subscribe((response) => {
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
