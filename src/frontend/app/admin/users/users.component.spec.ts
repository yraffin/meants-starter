/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { StubUsersService } from '../../stubs/stub-users.service';
import { TESTING_IMPORTS, TESTING_PROVIDERS } from '../../../testing-providers';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TESTING_IMPORTS],
      declarations: [UsersComponent],
      providers: [
        TESTING_PROVIDERS,
        { provide: UsersService, useClass: StubUsersService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should order list by email', () => {
    component.currentPage = 1;
    component.count = 20;
    component.orderListBy('email');
    expect(component.getSortDirection('email')).toBe('desc');
    component.orderListBy('email');
    expect(component.getSortDirection('email')).toBe('');
    component.orderListBy('email');
    expect(component.getSortDirection('email')).toBe('asc');
  });
});
