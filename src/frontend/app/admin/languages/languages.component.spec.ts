/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LanguagesComponent } from './languages.component';
import { LanguagesService } from './languages.service';
import { StubLanguagesService } from '../../stubs/stub-languages.service';
import { TESTING_IMPORTS, TESTING_PROVIDERS } from '../../../testing-providers';

describe('LanguagesComponent', () => {
  let component: LanguagesComponent;
  let fixture: ComponentFixture<LanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TESTING_IMPORTS],
      declarations: [LanguagesComponent],
      providers: [
        TESTING_PROVIDERS,
        { provide: LanguagesService, useClass: StubLanguagesService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should order list by name', () => {
    component.currentPage = 1;
    component.count = 20;
    component.orderListBy('name');
    expect(component.getSortDirection('name')).toBe('desc');
    component.orderListBy('name');
    expect(component.getSortDirection('name')).toBe('');
    component.orderListBy('name');
    expect(component.getSortDirection('name')).toBe('asc');
  });
});
