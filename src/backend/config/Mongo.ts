import { MongoClient, Db } from 'mongodb';
import * as config from 'config';
import { Service } from 'typedi';

/**
 * Represents the Mongo client service.
 * @class
 */
@Service()
export class Mongo {

  /** The mongo database object. @property {Db} */
  private _db: Db;

  /** The mongo url. @property {string} */
  private url: string = config.get('mongo.url').toString();

  /**
   * Connect and return the application mongo database.
   * @method
   * @returns {Promise<Db>}
   */
  async db() {
    if (!this._db) {
      this._db = await MongoClient.connect(this.url);
    }
    return this._db;
  }

  /**
   * Gets a value indicating the mongoDB health (TODO)
   * @method
   * @returns {Promise<boolean>}
   */
  async health() {
    // TODO manage health
    return true;
  }
}
