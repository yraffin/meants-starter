import { Class } from '../Utils';

/**
 * Represents the base metadata class.
 * @method
 */
export abstract class MetadataBase {

  /** The metadata name. @private @property {string} */
  private _name: string;

  /** The metadata name. @readonly @property {string} */
  get name(){
    return this._name;
  };

  /**
   * Initializes a new instance of the MetadataBase class.
   * @constructor
   * @param {string} name The collection name.
   */
  constructor(name?: string) {
    this._name = name || this.getClassName();
  }

  /**
   * Gets the current class name.
   * @method
   * @param {Class} metadata The metadata class.
   * @return {string}
   */
  protected getClassName(provider?: Class) {
    const self = provider ? provider : this.constructor as Function;
    if (self.name) {
      return self.name;
    }

    return self.toString().match(/^function\s*([^\s(]+)/)[1];
  }
}
