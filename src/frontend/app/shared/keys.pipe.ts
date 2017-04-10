import { Pipe, PipeTransform } from '@angular/core';

/**
 * Represents a dictionary to keys array pipe.
 * @class
 */
@Pipe({
  name: 'appKeys'
})
export class KeysPipe implements PipeTransform {

  /**
   * Transform an dictionary to a list of keys.
   * @param {any} value The dictionary to transform.
   * @param {any} args The transform arguments.
   */
  transform(value: any, args?: any): any {
    const keys = [];
    for (const key in value) {
      if (!value.hasOwnProperty(key)) {
        continue;
      }

      keys.push(key);
    }

    return keys;
  }

}
