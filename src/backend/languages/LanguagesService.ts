import { Service, Inject } from 'typedi';
import { ObjectID, Cursor } from 'mongodb';

import { LanguageModel } from './aggregates/LanguageModel';
import { CultureModel } from './aggregates/CultureModel';
import { LanguageResourceModel } from './aggregates/LanguageResourceModel';
import { MongoService, PaginationFilter } from '../core/MongoService';
import { NotFoundError, UnprocessableEntityError } from '../errors';
import { MongoCollection } from '../core/decorators';

/**
 * Represents the languages service.
 * @class
 * @extends {MongoService<LanguageModel>}
 */
@Service()
@MongoCollection('Languages')
export class LanguagesService extends MongoService<LanguageModel> {

  /** Represents the language resource service @property {LanguageResourcesService} */
  @Inject()
  @MongoCollection('LanguageResources')
  resourcesService: MongoService<LanguageResourceModel>;

  /**
   * Remove a language.
   * @method
   * @param {string} id The language identifier.
   * @returns {number} The number of deleted entities.
   */
  async remove(id: string) {
    const language = await this.get(id, { fields: { resources: 1 } });
    if (!language) {
      throw new NotFoundError(`language not found: ${id}`);
    }

    // delete resources
    await this.resourcesService.removeMany(language.resources);
    return this.removeOne(language.id);
  }

  /**
   * Gets the language resources.
   * @method
   * @param {string} langId The current language identifier.
   * @param {any} filter The list filter.
   * @param {PaginationFilter} pagination The pagination filter.
   * @return {Promise<LanguageResourceModel[]>}
   */
  async getResources(langId: string, filter: any, pagination?: PaginationFilter) {
    const language = await this.get(langId, { fields: { resources: 1 } });
    if (!language) {
      throw new NotFoundError(`language not found: ${langId}`);
    }

    const query = Object.assign({ _id: { $in: language.resources || [] } }, filter);
    return this.resourcesService.find(query, pagination);
  }

  /**
   * Gets the language resources number.
   * @method
   * @param {string} langId The current language identifier.
   * @param {any} filter The list filter.
   * @return {Promise<number>}
   */
  async countResources(langId: string, filter: any, pagination?: PaginationFilter) {
    const language = await this.get(langId, { fields: { resources: 1 } });
    if (!language) {
      throw new NotFoundError(`language not found: ${langId}`);
    }

    const query = Object.assign({ _id: { $in: language.resources || [] } }, filter);
    return this.resourcesService.count(query);
  }

  /**
   * Save a resource to a language.
   * @method
   * @param {string} langId The current language identifier.
   * @param {LanguageResourceModel} data The new resource model.
   * @returns {Promise<LanguageResourceModel>}
   */
  async saveResource(langId: string, data: LanguageResourceModel) {
    const language = await this.get(langId);
    if (!language) {
      throw new NotFoundError(`language not found: ${langId}`);
    }

    if (!data) {
      throw new UnprocessableEntityError(`resource can not be saved: ${JSON.stringify(data)}`);
    }

    const isNew = !data.id;
    const resource = await this.resourcesService.save(data);
    if (!isNew) {
      return resource;
    }

    await this.insertToFieldArray(language, 'resources', ObjectID.createFromHexString(resource.id));
    return resource;
  }

  /**
   * Remove a language resource.
   * @method
   * @param {string} langId The current language identifier.
   * @param {string} id The language identifier.
   * @returns {number} The number of deleted entities.
   */
  async removeResource(langId: string, id: string) {
    const language = await this.get(langId, { fields: { resources: 1 } });
    if (!language) {
      throw new NotFoundError(`language not found: ${id}`);
    }

    // delete resources
    const result = await this.resourcesService.removeOne(id);

    // delete resource identifier from language
    await this.removeFromFieldArray(language, 'resources', ObjectID.createFromHexString(id));

    return result;
  }

  /**
   * Gets the language resources for a specific culture.
   * @method
   * @param {string} culture The current language culture.
   * @return {Promise<LanguageResourceModel[]>}
   */
  async displayResources(culture: string) {
    const result = [];
    let language = await this.findOne({ culture });

    // if language not found use the first one.
    if (!language) {
      language = await this.findOne({});
    }

    // if still no language
    if (!language) {
      throw new NotFoundError('No language exists');
    }

    const query = { _id: { $in: language.resources || [] } };
    return this.resourcesService.filter(query, { key: 1, value: 1, _id: 0 });
  }
}

export { LanguageModel, LanguageResourceModel, CultureModel };
