import { Service, Inject } from 'typedi';
import { ObjectID, FindOneOptions, Cursor, Collection } from 'mongodb';
import * as _ from 'lodash';

import { Mongo } from '../config/Mongo';
import { MongoModelBase } from './MongoModelBase';
import { METADATA_KEY } from './decorators';

/**
 * Represents the pagination filter.
 * @class
 */
export class PaginationFilter {
  /** Represents the sort filter @property {any} */
  filter?: any;

  /** Represents the sort filter @property {string} */
  sort?: string;

  /** Represents the page number @property {number} */
  page: number;

  /** Represents the page limit @property {number} */
  limit: number;
}

/**
 * Represents the base mongo service.
 * @class
 */
@Service()
export class MongoService<TDocument extends MongoModelBase> {

  /** The mongodb collection name. @private @property {string} */
  protected collectionName: string;

  /** Represents The mongodb configuration @property {Mongo} */
  @Inject()
  mongodb: Mongo;

  /**
   * Gets a MongoDB collection.
   * @method
   * @param {string} name The name of the requested collection.
   * @returns {Promise<Collection>}
   */
  async collection(name?: string) {
    const db = await this.mongodb.db();
    return db.collection(name || this.collectionName);
  }

  /**
   * Gets a list of collection documents depends on the pagination filter.
   * @method
   * @param {PaginationFilter} pagination The requested pagination filter.
   * @returns {Promise<TDocument[]>}
   */
  async all(pagination?: PaginationFilter) {
    const col = await this.collection();
    const query = col.find() as Cursor<TDocument>;
    this.preparePaginationQuery(query, pagination);
    const documents = await query.toArray();
    (documents || []).forEach(item => this.serialize(item));
    return documents;
  }

  /**
   * Gets a list of collection documents depends on query and pagination filter.
   * @method
   * @param {Object} query The query filter.
   * @param {PaginationFilter} pagination The requested pagination filter.
   * @returns {Promise<TDocument[]>}
   */
  async find(query: any, pagination?: PaginationFilter) {
    const col = await this.collection();
    const cursor = col.find(query) as Cursor<TDocument>;
    this.preparePaginationQuery(cursor, pagination);
    const documents = await cursor.toArray();
    (documents || []).forEach(item => this.serialize(item));
    return documents;
  }

  /**
   * Gets a list of collection partial documents depends on query and pagination filter.
   * Only document properties defined in select Object would be returned.
   * @method
   * @param {Object} query The query filter.
   * @param {Object} select The document properties to request.
   * @param {PaginationFilter} pagination The requested pagination filter.
   * @returns {Promise<TDocument[]>}
   */
  async filter(query: any, select: Object, pagination?: PaginationFilter) {
    const col = await this.collection();
    let cursor = col.find(query) as Cursor<TDocument>;
    cursor = this.preparePaginationQuery(cursor, pagination);
    const documents = await cursor.project(select).toArray();
    (documents || []).forEach(item => this.serialize(item));
    return documents;
  }

  /**
   * Gets the number of collection documents depends on query and pagination filter.
   * @method
   * @param {Object} query The query filter.
   * @returns {Promise<number>}
   */
  async count(query?: any) {
    const col = await this.collection();
    return col.count(query || {});
  }

  /**
   * Gets a document by its identifier.
   * @method
   * @param {string} id The requested document identifier.
   * @param {FindOneOptions} options The request options.
   * @returns {Promise<TDocument>}
   */
  async get(id: string, options?: FindOneOptions) {
    const col = await this.collection();
    const document = await col.findOne({ _id: ObjectID.createFromHexString(id) }, options) as TDocument;
    this.serialize(document);
    return document;
  }

  /**
   * Gets the first document solving the filter query.
   * @method
   * @param {Object} filter The requested filter.
   * @param {FindOneOptions} options The request options.
   * @returns {Promise<TDocument>}
   */
  async findOne(filter: Object, options?: FindOneOptions) {
    const col = await this.collection();
    const document = await col.findOne(filter, options) as TDocument;
    this.serialize(document);
    return document;
  }

  /**
   * Insert one document to the collection.
   * @method
   * @param {TDocument} document The Document to insert.
   * @returns {Promise<TDocument>}
   */
  async insertOne(document: TDocument) {
    const col = await this.collection();
    const inserted = await col.insertOne(document);
    return this.get(inserted.insertedId.toHexString());
  }

  /**
   * Insert many documents to the collection.
   * @method
   * @param {TDocument[]} documents The Documents to insert.
   * @returns {Promise<TDocument[]>}
   */
  async insertMany(documents: TDocument[]) {
    const col = await this.collection();
    const inserted = await col.insertMany(documents);
    return this.find({ _id: { $in: inserted.insertedIds } });
  }

  /**
   * Update a collection document.
   * @method
   * @param {TDocument} document The Document to update.
   * @param {boolean} replace Value indicating whether to replace the entire document or partially update.
   * @returns {Promise<TDocument>}
   */
  async updateOne(document: TDocument, replace?: boolean) {
    const col = await this.collection();
    const id = document.id;
    const _id = ObjectID.createFromHexString(id);
    delete document.id;
    const update = replace ? document : { $set: document };
    const updated = await col.updateOne({ '_id': _id }, update);
    return this.get(id);
  }

  /**
   * Remove collection document.
   * @method
   * @param {string} id The Document identifier to remove.
   * @returns {Promise<number>}
   */
  async removeOne(id: string) {
    const col = await this.collection();
    const _id = ObjectID.createFromHexString(id);
    const result = await col.deleteOne({ _id: _id });
    return result.deletedCount;
  }

  /**
   * Remove may collection documents.
   * @method
   * @param {ObjectID[]} ids The Document identifiers to remove.
   * @returns {Promise<number>}
   */
  async removeMany(ids: ObjectID[]) {
    const col = await this.collection();
    const result = await col.deleteMany({ _id: { $in: ids || [] } });
    return result.deletedCount;
  }

  /**
   * Insert a value into a document field array.
   * @method
   * @param {TDocument} document The Document to update.
   * @param {string} field The document field array name.
   * @param {any} value The value to insert in document field array.
   * @returns {Promise<void>}
   */
  async insertToFieldArray(document: TDocument, field: string, value: any) {
    const col = await this.collection();
    const _id = ObjectID.createFromHexString(document.id);
    const $push = {};
    $push[field] = value;
    const push = { $push: $push };
    await col.updateOne({ '_id': _id }, push);
  }

  /**
   * Remove a value from a document field array.
   * @method
   * @param {TDocument} document The Document to update.
   * @param {string} field The document field array name.
   * @param {any} value The value to remove from the document field array.
   * @returns {Promise<void>}
   */
  async removeFromFieldArray(document: TDocument, field: string, value: any) {
    const col = await this.collection();
    const _id = ObjectID.createFromHexString(document.id);
    const $pull = {};
    $pull[field] = value;
    const pull = { $pull: $pull };
    await col.updateOne({ '_id': _id }, pull);
  }

  /**
   * Save a collection document. (Insert or update)
   * @method
   * @param {TDocument} document The Document to insert/update.
   * @returns {Promise<TDocument>}
   */
  async save(document: TDocument) {
    if (document.id) {
      return this.updateOne(document);
    }

    return this.insertOne(document);
  }

  /**
   * Serialize a document to replace ObjectID by string identifier.
   * @method
   * @param {TDocument} document The Document to insert/update.
   */
  protected serialize(document: TDocument) {
    if (!document || !document._id) {
      return;
    }

    document.id = document._id.toHexString();
    delete document._id;
  }

  /**
   * Gets the query sort object from string.
   * @method
   * @param {string} sort The string query sort to deserialize.
   * @returns {string[][]}
   */
  protected getQuerySort(sort: string): Array<string[]> {
    if (!sort || sort.replace(/ /gi, '') === '') {
      return null;
    }

    const querySort: string[][] = [];
    sort.split(',').forEach(column => {
      const parts = column.split(':');
      if (parts.length !== 2) {
        throw new Error('sorting column format error : ' + column);
      }

      querySort.push([parts[0], parts[1].toLowerCase()]);
    });

    return querySort;
  }

  /**
   * Prepare the filter query from pagination filter.
   * @method
   * @param {Cursor<TDocument>} query The current MongoDB query.
   * @param {PaginationFilter} pagination The requested pagination filter.
   * @returns {Cursor<TDocument>}
   */
  protected preparePaginationQuery(query: Cursor<TDocument>, pagination: PaginationFilter) {
    const querySort = this.getQuerySort(pagination && pagination.sort);
    if (!!querySort) {
      query = query.sort(querySort);
    }

    const limit = parseInt((pagination && pagination.limit || 0).toString(), 10) || 0;
    const page = parseInt((pagination && pagination.page || 0).toString(), 10) || 0;

    if (limit > 0 && page > 0) {
      query = query.skip(limit * (page - 1)).limit(limit);
    }

    return query;
  }

}
