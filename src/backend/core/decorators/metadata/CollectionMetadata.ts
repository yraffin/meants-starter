import { MetadataBase } from './MetadataBase';

/**
 * Represents the collection metadata.
 * @method
 */
export class CollectionMetadata extends MetadataBase {

  /**
   * Initializes a new instance of the CollectionMetadata class.
   * @constructor
   * @param {string} name The collection name.
   */
  constructor(name: string) {
    super(name);

    if (!name || name.replace(/ /ig, '') === '') {
      throw new TypeError('Collection metadata should have a name defined.');
    }
  }
}
