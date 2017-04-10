import { OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../environments/environment';

/**
 * Represents the sort class
 * @class
 */
export class Sort {
  /** Gets or sets the list element total. @property {string} */
  column: string;

  /** Gets or sets the list element total. @property {string} */
  direction: string;
}

export class ListFormParams {
  /** Gets or sets the list search text input. @property {string} */
  search?: string;

  /** Gets or sets the current page. @property {number} */
  page: number;

  /** Gets or sets the page element limit. @property {number} */
  limit: number;

  /** Gets or sets the sorting list string. @property {string} */
  sort: string;
}

export class TotalModel {
  /** Gets or sets the total number of elements. @property {number} */
  count: number;
}

/**
 * Base list component for managing pagination and sorting for a list.
 * @class
 */
export abstract class BaseListComponent<TEntity> implements OnInit, OnDestroy {
  /** Gets or sets value indicating whether search on list is enabled. @property {boolean} */
  searchEnabled = true;

  /** Gets or sets the data list. @property {TEntity[]} */
  data: TEntity[];

  /** Gets or sets the filters form group. @property {FormGroup} */
  filterForm: FormGroup;

  /** Gets or sets the list search text input. @property {string} */
  search: string;

  /** Gets or sets the list last search text input. @property {string} */
  lastSearch: string;

  /** Gets or sets the list element total. @property {number} */
  count: number;

  /** Gets or sets the page element limit. @property {number} */
  limit = environment.page.limit;

  /** Gets or sets the current page. @property {number} */
  currentPage = 1;

  /** Gets or sets the sorting list. @property {Sort[]} */
  sorts: Array<Sort> = [];

  /**
   * Gets the string sort list.
   * @method
   * @property {string}
   */
  get sort(): string {
    if (!this.sorts || this.sorts.length === 0) {
      return '';
    }

    return this.sorts.map(item => item.column + ':' + item.direction).join(',');
  }

  /**
   * Initializes a new instance of the {BaseListComponent}
   * @constructor
   * @param {FormBuilder} formBuilder The angular form builder.
   */
  constructor(
    protected formBuilder: FormBuilder
  ) {
  }

  /**
   * Occurred when component initializes.
   * @method
   */
  ngOnInit() {
    const params: ListFormParams = {
      sort: this.sort,
      page: this.currentPage,
      limit: this.limit
    };

    // if search enabled add form serach param
    if (this.searchEnabled) {
      params.search = '';
    }

    this.filterForm = this.formBuilder.group(params);
    this.filterForm.setValue(params);

    this.initTable();

    this.filterForm.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(parameters => {
        if (parameters.search !== this.lastSearch) {
          this.lastSearch = parameters.search;
          this.getTotal(parameters.search).subscribe(result => this.count = result.count);
        }

        return this.getAll(parameters);
      })
      .subscribe(data => {
        this.data = data;
        this.currentPage = this.filterForm.value.page;
      });
  }

  /**
   * Occurred when component initializes.
   * @method
   */
  ngOnDestroy() {
  }

  /**
   * Initializes the list table.
   * @method
   */
  initTable() {
    this.getTotal(this.filterForm.value.search).subscribe(result => this.count = result.count);
    this.getAll(this.filterForm.value).subscribe(result => this.data = result);
  }

  /**
   * Gets all the element for a page.
   * @method
   * @param {ListFormParams} parameters The current search parameters.
   * @returns {Observable<TEntity[]>}
   */
  abstract getAll(parameters?: ListFormParams): Observable<TEntity[]>;

  /**
   * Gets the total number of element.
   * @method
   * @param {string} search The searching terms.
   * @returns {Observable<TotalModel>}
   */
  abstract getTotal(search?: string): Observable<TotalModel>;

  /**
   * Gets the sort direction for a column.
   * @method
   * @param {string} column The column name to sort.
   */
  getSortDirection(column: string) {
    const sort = this.sorts.find(item => item.column === column);
    return sort ? sort.direction : '';
  }

  /**
   * Order list by columns.
   * @method
   * @param {string} column Sorting column.
   */
  orderListBy(column: string) {
    const sort = this.sorts.find(item => item.column === column);
    if (!sort) {
      // add new sorts columns
      this.sorts.push({ column: column, direction: 'asc' });
    } else if (sort.direction === 'asc') {
      sort.direction = 'desc';
    } else {
      const index = this.sorts.indexOf(sort);
      this.sorts.splice(index, 1);
    }

    this.currentPage = 1;
    this.filterForm.patchValue({ page: this.currentPage, sort: this.sort });
  }

  /**
   * Occurrend when page changed.
   * @method
   * @param {number} pageIndex The new page index.
   */
  onPageChanged(pageIndex: number) {
    this.currentPage = pageIndex;
    this.filterForm.patchValue({ page: pageIndex });
  }
}
