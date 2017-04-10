/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RightsComponent } from './rights.component';
import { UsersService } from '../users.service';
import { StubUsersService } from '../../../stubs/stub-users.service';
import { TESTING_IMPORTS, TESTING_PROVIDERS } from '../../../../testing-providers';

describe('RightsComponent', () => {
  let component: RightsComponent;
  let fixture: ComponentFixture<RightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TESTING_IMPORTS],
      declarations: [ RightsComponent ],
      providers: [
        TESTING_PROVIDERS,
        { provide: UsersService, useClass: StubUsersService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
