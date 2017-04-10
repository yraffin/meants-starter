/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'underscore';

import { CreateComponent } from './create.component';
import { CreateOrUpdateComponent } from '../create-or-update/create-or-update.component';
import { UsersService } from '../users.service';
import { StubUsersService, UsersModel } from '../../../stubs/stub-users.service';
import { TESTING_IMPORTS, TESTING_PROVIDERS } from '../../../../testing-providers';


const defaultUser = {
  id: 0,
  civilite: 0,
  email: 'user@test.fr',
  firstname: 'user',
  lastname: 'TEST'
};


describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let child: DebugElement;
  let childComponent: CreateOrUpdateComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TESTING_IMPORTS],
      declarations: [CreateComponent, CreateOrUpdateComponent],
      providers: [
        TESTING_PROVIDERS,
        { provide: UsersService, useClass: StubUsersService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    child = fixture.debugElement.query(By.directive(CreateOrUpdateComponent));
    childComponent = child.injector.get(CreateOrUpdateComponent) as CreateOrUpdateComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(child).not.toBeNull();
    expect(childComponent).toBeTruthy();
  });

  it('should not save the child component', () => {
    component.onUserSubmitted = jasmine.createSpy('onUserSubmitted');
    childComponent.form.patchValue({ email: '' });
    childComponent.save(new Event('click'));
    expect(component.onUserSubmitted).not.toHaveBeenCalled();
  });

  it('should save the child component', () => {
    component.onUserSubmitted = jasmine.createSpy('onUserSubmitted').and.callThrough();
    childComponent.form.patchValue(defaultUser);
    childComponent.save(new Event('click'));
    fixture.detectChanges();
    expect(component.onUserSubmitted).toHaveBeenCalledWith(defaultUser);
  });

  it('should save the child component and go to update view', () => {
    const router = TestBed.get(Router) as Router;
    router.navigate = jasmine.createSpy('navigate');
    childComponent.form.patchValue(defaultUser);
    childComponent.save(new Event('click'));
    fixture.detectChanges();
    const newId = _.max(UsersModel, user => user.id || 0).id + 1;
    expect(router.navigate).toHaveBeenCalledWith(['update', newId]);
  });
});
