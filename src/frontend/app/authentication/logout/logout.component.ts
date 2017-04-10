import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizationService } from '../authorization.service';

/**
 * Represents the logout components.
 * @class
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  /**
   * Initializes a new instance of the LogoutComponent class.
   * @constructor
   */
  constructor(private router: Router, private authorizationService: AuthorizationService) { }

  /**
   * Executed on component Initialization.
   * @method
   */
  ngOnInit() {
    this.authorizationService.logout();
    this.router.navigate(['']);
  }

}
