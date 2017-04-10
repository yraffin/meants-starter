import { Injectable } from '@angular/core';

/**
 * Represents the application storage service.
 * @class
 */
@Injectable()
export class StorageService {

  /**
   * Initialize the StorageService class.
   * @constructor
   */
  constructor() { }

  /**
   * Gets the storage engine.
   * @property {Object}
   */
  get engine() {
    return localStorage;
  }

  /**
   * Gets an item from the app storage engine.
   * @method
   * @param {string} key The queried item name.
   * @return The item
   */
  getItem<T>(key: string): T {
    return JSON.parse(this.engine.getItem(key));
  }

  /**
   * Gets an item from the app storage engine.
   * @method
   * @param {string} key The queried item name.
   * @param {T} item The current item to store.
   */
  setItem<T>(key: string, item: T) {
    if (!item) {
      this.removeItem(key);
      return;
    }

    this.engine.setItem(key, JSON.stringify(item));
  }

  /**
   * Remove an item from the app storage engine.
   * @method
   * @param {string} key The queried item name.
   */
  removeItem(key: string) {
    this.engine.removeItem(key);
  }

  /**
   * Clear the app storage engine.
   * @method
   */
  clear() {
    this.engine.clear();
  }
}
