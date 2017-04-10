/**
 * Defines the default filter list params.
 * @class
 * @param {string} sort Represents the sort column.
 * @param {number} page Represents the page index.
 * @param {number} limit Represents the page elements limit.
 */
export class ListFilterParams {
  sort?: string;
  page: number;
  limit: number;
}
