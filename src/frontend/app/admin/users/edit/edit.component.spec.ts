/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { CreateOrUpdateComponent } from '../create-or-update/create-or-update.component';
import { EditComponent } from './edit.component';
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

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let child: DebugElement;
  let childComponent: CreateOrUpdateComponent;
  let params: Subject<Params>;

  beforeEach(async(() => {
    params = new Subject<Params>();
    TestBed.configureTestingModule({
      imports: [TESTING_IMPORTS],
      declarations: [EditComponent, CreateOrUpdateComponent],
      providers: [
        TESTING_PROVIDERS,
        { provide: UsersService, useClass: StubUsersService },
        { provide: ActivatedRoute, useValue: { params: params } }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    child = fixture.debugElement.query(By.directive(CreateOrUpdateComponent));
    childComponent = child.injector.get(CreateOrUpdateComponent) as CreateOrUpdateComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not get the user by its identifier', fakeAsync(() => {
    const service = TestBed.get(UsersService) as UsersService;
    const userId = 5;
    service.getById = jasmine.createSpy('getById').and.returnValue(Observable.of(UsersModel.find(item => item.id === userId)));

    // update route params
    params.next({ 'id': '' });

    // tick to make sure the async observable resolves
    tick();

    expect(service.getById).not.toHaveBeenCalled();
  }));

  it('should get the user by its identifier', fakeAsync(() => {
    const service = TestBed.get(UsersService) as UsersService;
    const userId = 5;
    service.getById = jasmine.createSpy('getById').and.returnValue(Observable.of(UsersModel.find(item => item.id === userId)));

    // update route params
    params.next({ 'id': userId });

    // tick to make sure the async observable resolves
    tick();

    expect(service.getById).toHaveBeenCalledWith(userId);
  }));

  it('should not save the child component', () => {
    component.onUserSubmitted = jasmine.createSpy('onUserSubmitted');
    childComponent.form.patchValue({ email: '' });
    childComponent.save(new Event('click'));
    expect(component.onUserSubmitted).not.toHaveBeenCalled();
  });

  it('should save the child component', fakeAsync(() => {
    component.onUserSubmitted = jasmine.createSpy('onUserSubmitted').and.callThrough();
    childComponent.form.patchValue(defaultUser);
    childComponent.save(new Event('click'));
    fixture.detectChanges();
    expect(component.onUserSubmitted).toHaveBeenCalledWith(defaultUser);
  }));

  it('should save the child component and return to list', fakeAsync(() => {
    const router = TestBed.get(Router) as Router;
    router.navigate = jasmine.createSpy('navigate');
    childComponent.form.patchValue(defaultUser);
    childComponent.save(new Event('click'));
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  }));
});
