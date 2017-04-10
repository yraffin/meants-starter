/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateOrUpdateComponent } from './create-or-update.component';
import { UsersService } from '../users.service';
import { StubUsersService } from '../../../stubs/stub-users.service';
import { TESTING_IMPORTS, TESTING_PROVIDERS } from '../../../../testing-providers';

describe('CreateOrUpdateComponent', () => {
  let component: CreateOrUpdateComponent;
  let fixture: ComponentFixture<CreateOrUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TESTING_IMPORTS],
      declarations: [ CreateOrUpdateComponent ],
      providers: [
        TESTING_PROVIDERS,
        { provide: UsersService, useClass: StubUsersService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
