/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let event: Event;

  beforeEach(async(() => {
    event = new Event('click');

    TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create pages', () => {
    component.count = 0;
    component.current = 1;
    component.ngOnChanges({
      count: { currentValue: 0, previousValue: undefined, isFirstChange: () => false },
      current: { currentValue: 1, previousValue: undefined, isFirstChange: () => false },
    });
    fixture.detectChanges();
    expect(component.pages.length).toBe(0);
  });

  it('should create 3 pages', () => {
    component.count = 21;
    component.current = 1;
    component.ngOnChanges({
      count: { currentValue: 21, previousValue: undefined, isFirstChange: () => false },
      current: { currentValue: 1, previousValue: undefined, isFirstChange: () => false },
    });
    fixture.detectChanges();
    expect(component.pages.length).toBe(3);
  });

  it('should create 13 pages', () => {
    component.count = 200;
    component.current = 1;
    component.ngOnChanges({
      count: { currentValue: 200, previousValue: undefined, isFirstChange: () => false },
      current: { currentValue: 1, previousValue: undefined, isFirstChange: () => false },
    });
    fixture.detectChanges();
    expect(component.pages.length).toBe(13);
  });

  it('should go previous if not first page', () => {
    component.count = 200;
    component.current = 14;
    component.ngOnChanges({
      count: { currentValue: 200, previousValue: undefined, isFirstChange: () => false },
      current: { currentValue: 14, previousValue: undefined, isFirstChange: () => false },
    });
    fixture.detectChanges();

    component.pageChanged.emit = jasmine.createSpy('emit');
    component.previous(event);
    expect(component.pageChanged.emit).toHaveBeenCalledWith(13);
  });

  it('should not go previous if first page', () => {
    component.count = 200;
    component.current = 1;
    component.ngOnChanges({
      count: { currentValue: 200, previousValue: undefined, isFirstChange: () => false },
      current: { currentValue: 1, previousValue: undefined, isFirstChange: () => false },
    });
    fixture.detectChanges();

    component.pageChanged.emit = jasmine.createSpy('emit');
    component.previous(event);
    expect(component.pageChanged.emit).not.toHaveBeenCalled();
  });

  it('should go next if not last page', () => {
    component.count = 200;
    component.current = 16;
    component.ngOnChanges({
      count: { currentValue: 200, previousValue: undefined, isFirstChange: () => false },
      current: { currentValue: 16, previousValue: undefined, isFirstChange: () => false },
    });
    fixture.detectChanges();

    component.pageChanged.emit = jasmine.createSpy('emit');
    component.next(event);
    expect(component.pageChanged.emit).toHaveBeenCalledWith(17);
  });

  it('should not go next if last page', () => {
    component.count = 200;
    component.current = 20;
    component.ngOnChanges({
      count: { currentValue: 200, previousValue: undefined, isFirstChange: () => false },
      current: { currentValue: 20, previousValue: undefined, isFirstChange: () => false },
    });
    fixture.detectChanges();

    component.pageChanged.emit = jasmine.createSpy('emit');
    component.next(event);
    expect(component.pageChanged.emit).not.toHaveBeenCalled();
  });

  it('should not change page when click on current', () => {
    component.count = 200;
    component.current = 6;
    component.ngOnChanges({
      count: { currentValue: 200, previousValue: undefined, isFirstChange: () => false },
      current: { currentValue: 6, previousValue: undefined, isFirstChange: () => false },
    });
    fixture.detectChanges();

    component.pageChanged.emit = jasmine.createSpy('emit');
    component.changePage(event, 6);
    expect(component.pageChanged.emit).not.toHaveBeenCalled();
  });
});
