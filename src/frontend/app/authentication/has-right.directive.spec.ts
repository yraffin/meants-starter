/* tslint:disable:no-unused-variable */
import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AuthorizationService } from '../authentication/authorization.service';
import { HasRightDirective } from './has-right.directive';
import { TESTING_PROVIDERS, TESTING_IMPORTS } from '../../testing-providers';

@Component({
  template: `<span *appHasRight="'R_API_TEST_R'"></span>`
})
class TestHasRightComponent {
}

describe('HasRightDirective', () => {

  let component: TestHasRightComponent;
  let fixture: ComponentFixture<TestHasRightComponent>;
  let spanEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TESTING_IMPORTS
      ],
      declarations: [TestHasRightComponent],
      providers: [
        TESTING_PROVIDERS
      ]
    });
    fixture = TestBed.createComponent(TestHasRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spanEl = fixture.debugElement.query(By.css('span'));
  });

  it('should create', inject([AuthorizationService], (authorizationService: AuthorizationService) => {
    expect(component).toBeTruthy();
  }));

  it('should create', inject([AuthorizationService], (authorizationService: AuthorizationService) => {
    expect(spanEl).toBeNull();
    authorizationService.rights = ['R_API_TEST_R'];
    fixture.detectChanges();
    spanEl = fixture.debugElement.query(By.css('span'));
    expect(spanEl).not.toBeNull();
  }));
});
