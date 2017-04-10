import { Component, Input, Output, ViewChild, ElementRef, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';


import { environment } from '../../../environments/environment';

/**
 * Represents the pagination component.
 * @class
 */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {

  /** Gets or sets the total of pages @property {number} */
  totalPages = 0;

  /** Gets or sets the list of used pages @property {any[]} */
  pages = [];

  /** Gets or sets the current page @property {number} */
  @Input() current: number;

  /** Gets or sets the nbr item per page @property {number} */
  @Input() limit: number;

  /** Gets or sets the total number of elements @property {number} */
  @Input() count: number;

  /** Gets or sets the total of pages @property {number} */
  @Input() gap: number;

  /** Gets or sets the page changed event @property {number} */
  @Output() pageChanged = new EventEmitter();

  /**
   * Initializes a new instance of the PaginationComponent class.
   * @constructor
   */
  constructor() { }

  /**
   * Occured when component inputs changed.
   * @method
   * @param {SimpleChanges} changes The list of changed properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    this.create();
  }

  /**
   * Create the component pages.
   * @method
   */
  create() {
    const limit = this.limit && !isNaN(this.limit) && this.limit > 0 ? this.limit : environment.page.limit;
    this.pages = [];
    if (!this.count || isNaN(this.count) || this.count <= limit) {
      this.pages = [];
      this.totalPages = 0;
      return;
    }

    const gap = this.gap && !isNaN(this.gap) ? this.gap : environment.page.gap;
    const extremities = this.getPageExtremities();

    let page;
    if (extremities.pageMin > 0) {
      page = {};
      page.label = 1;
      page.index = 1;
      this.pages.push(page);
    }
    if (extremities.pageMin >= (gap - 1)) {
      page = {};
      page.index = Math.ceil(extremities.pageMin / 2) + 1;
      page.label = page.index;
      this.pages.push(page);
    }
    for (let i = extremities.pageMin; i < extremities.pageMax; i++) {
      page = {};
      page.label = i + 1;
      page.index = i + 1;
      this.pages.push(page);
    }
    if (extremities.pageMax <= this.totalPages - (gap - 1)) {
      page = {};
      page.index = Math.ceil(extremities.pageMax + ((this.totalPages - extremities.pageMax) / 2));
      page.label = page.index;
      this.pages.push(page);
    }
    if (extremities.pageMax < this.totalPages) {
      page = {};
      page.label = this.totalPages;
      page.index = this.totalPages;
      this.pages.push(page);
    }
  }

  /**
   * Gets the page number upscale in order to have all the time the same nbre of page.
   * @method
   * @param {number} pageMin The min page index.
   * @param {number} pageMax The max page index.
   */
  getPageExtremities() {
    const gap = this.gap && !isNaN(this.gap) ? this.gap : environment.page.gap;
    const limit = this.limit && !isNaN(this.limit) && this.limit > 0 ? this.limit : environment.page.limit;

    this.totalPages = Math.ceil(this.count / limit);

    let pageMin = Math.max(0, this.current - gap - 1);
    let pageMax = Math.min(this.current + gap, this.totalPages);

    // we want min first/middle to first/gap/current/gap/middle to last/last
    if (this.totalPages <= (2 * gap + 5)) {
      return { pageMin: 0, pageMax: this.totalPages };
    }

    if (pageMin < gap - 1) {
      pageMin = 0;
      pageMax = 2 * gap + 3;
      return { pageMin, pageMax };
    }

    if (pageMax > this.totalPages - 1) {
      pageMax = this.totalPages;
      pageMin = pageMax - (2 * gap + 3);
      return { pageMin, pageMax };
    }

    return { pageMin, pageMax };
  }

  /**
   * Called when page link is clicked.
   * @method
   * @param {Event} event The click event.
   * @param {number} pageIndex The clicked page index.
   */
  changePage(event: Event, pageIndex: number) {
    event.preventDefault();
    if (pageIndex === this.current) {
      return;
    }

    this.pageChanged.emit(pageIndex);
  }

  /**
   * Called when page link is clicked.
   * @method
   * @param {Event} event The click event.
   */
  previous(event: Event) {
    event.preventDefault();
    if (this.current <= 1) {
      return;
    }

    this.changePage(event, this.current - 1);
  }

  /**
   * Called when page link is clicked.
   * @method
   * @param {Event} event The click event.
   */
  next(event: Event) {
    event.preventDefault();
    if (this.current >= this.totalPages) {
      return;
    }

    this.changePage(event, this.current + 1);
  }
}
