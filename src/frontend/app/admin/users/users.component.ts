import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { UsersService } from './users.service';
import { UserModel } from './user-model';
import { environment } from '../../../environments/environment';
import { BaseListComponent, ListFormParams } from '../../core/base-list-component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseListComponent<UserModel> implements OnInit {

  /**
   * Initializes a new instance of the UsersComponent.
   * @constructor
   * @param {UsersService} usersService The application users service.
   * @param {FormBuilder} formBuilder The angular form builder.
   */
  constructor(
    private usersService: UsersService,
    formBuilder: FormBuilder
  ) {
    super(formBuilder);
  }

  /**
   * Occurred when component initializes.
   * @method
   */
  ngOnInit() {
    this.sorts.push({ column: 'email', direction: 'asc' });
    super.ngOnInit();
  }

  /**
   * Gets all the element for a page.
   * @method
   * @param {ListFormParams} parameters The current search parameters.
   * @returns {Observable<TEntity[]>}
   */
  getAll(parameters?: ListFormParams){
    return this.usersService.all(parameters);
  }

  /**
   * Gets the total number of element.
   * @method
   * @param {string} search The searching terms.
   * @returns {Observable<TotalModel>}
   */
  getTotal(search?: string){
    return this.usersService.allCount(search);
  }

  /**
   * Delete a user.
   * @method
   * @param {Event} event The current click event.
   * @param {string} id The user identifier.
   */
  deleteUser(event: Event, id: string) {
    event.preventDefault();
    this.usersService.remove(id)
      .subscribe(data => this.initTable());
  }
}
