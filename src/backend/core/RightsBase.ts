/**
 * Represents the base rights.
 * @class
 */
export abstract class RightsBase {
  static CREATE = '';
  static READ = '';
  static UPDATE = '';
  static DELETE = '';

  static get ALL() {
    const all = [];
    Object.keys(this).forEach(key => all.push(this[key]));
    return all;
  }
};
