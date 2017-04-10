import { UseBefore, QueryParam, JsonController, Get, Post, Put, Param, Delete, Body } from 'routing-controllers';
import { Service, Inject } from 'typedi';
import _ = require('lodash');
import { ObjectID } from 'mongodb';

import { LanguageModel, LanguageResourceModel, CultureModel, LanguagesService } from './LanguagesService';
import { IsLogged, Authorize } from '../config/authentication';
import * as countryList from 'iso-3166-country-list';
import { UnprocessableEntityError } from '../errors';
import { LanguageRights, LanguageResourceRights } from '../core/Rights';

/**
 * Represents the language controller.
 * @class
 */
@Service()
@JsonController('/languages')
export class LanguagesController {

  /** Represents the language service @property {LanguagesService} */
  @Inject()
  languagesService: LanguagesService;

  constructor() {
  }

  /**
   * Gets the user list filter by search text.
   * @method
   * @param {string} search The searching terms.
   * @returns The mongo filter.
   */
  private getResourceListFilter(search: string) {
    let filter = {} as any;
    if (!search || search.replace(/ /ig, '') === '') {
      return filter;
    }

    filter = {
      '$or': [
        { 'key': new RegExp(search, 'ig') },
        { 'value': new RegExp(search, 'ig') }
      ]
    };

    return filter;
  }

  /**
   * @swagger
   * /api/languages/cultures:
   *   get:
   *     description: Returns the list of cultures.
   *     operationId: getCultures
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     responses:
   *       200:
   *         description: list of code/name cultures.
   *         schema:
   *           type: array
   *           items:
   *              $ref: '#/definitions/CultureModel'
   */
  @Get('/cultures')
  async getCultures(): Promise<CultureModel[]> {
    const result = countryList;
    _.each(result, (item) => item.code = item.code.toLowerCase());
    return Promise.resolve(result);
  }

  /**
   * @swagger
   * /api/languages/:
   *   get:
   *     description: Returns the list of languages.
   *     operationId: getAll
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: sort
   *         in: query
   *         description: Sort column order.
   *         required: false
   *         type: string
   *       - name: page
   *         in: query
   *         description: Current page.
   *         required: false
   *         type: number
   *       - name: limit
   *         in: query
   *         description: Number of page element.
   *         required: false
   *         type: number
   *     responses:
   *       200:
   *         description: list of key/value translation.
   *         schema:
   *           type: array
   *           items:
   *              $ref: '#/definitions/LanguageModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Get('/')
  @UseBefore(IsLogged, Authorize(...LanguageRights.ALL))
  async getAll(
    @QueryParam('sort') sort: string,
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number
    ): Promise<LanguageModel[]> {
    return this.languagesService.filter({}, { resources: 0 }, { sort, page, limit });
  }

  /**
   * @swagger
   * /api/languages/count:
   *   get:
   *     description: Returns the list of languages.
   *     operationId: count
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: number of languages.
   *         schema:
   *           type: object
   *           properties:
   *             count:
   *               type: number
   *     security:
   *        - jwt_token: [ ]
   */
  @Get('/count')
  @UseBefore(IsLogged, Authorize(...LanguageRights.ALL))
  async count(): Promise<{ count: number }> {
    const count = await this.languagesService.count();
    return { count: count };
  }

  /**
   * @swagger
   * /api/languages/:
   *   post:
   *     description: Create a new language.
   *     operationId: create
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: languagesModel
   *         in: body
   *         description: The languages model.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/LanguageModel'
   *     responses:
   *       200:
   *         description: The created object.
   *         schema:
   *           $ref: '#/definitions/LanguageModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Post('/')
  @UseBefore(IsLogged, Authorize(LanguageRights.CREATE))
  async create( @Body({ required: true }) data: LanguageModel) {
    return this.languagesService.save(data);
  }

  /**
   * @swagger
   * /api/languages/{id}:
   *   put:
   *     description: Create a new language.
   *     operationId: create
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: id
   *         in: path
   *         description: The lang resource identifier.
   *         required: true
   *         type: string
   *       - name: languagesModel
   *         in: body
   *         description: The languages model.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/LanguageModel'
   *     responses:
   *       200:
   *         description: The created object.
   *         schema:
   *           $ref: '#/definitions/LanguageModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Put('/:id')
  @UseBefore(IsLogged, Authorize(LanguageRights.UPDATE))
  async update(
    @Param('id') id: string,
    @Body({ required: true }) data: LanguageModel
    ) {
    if (data.id !== id) {
      throw new UnprocessableEntityError('Bad language');
    }

    return this.languagesService.save(data);
  }

  /**
   * @swagger
   * /api/languages/{id}:
   *   delete:
   *     description: Delete new language.
   *     operationId: delete
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: id
   *         in: path
   *         description: The lang resource identifier.
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: number of languages deleted.
   *         schema:
   *           type: object
   *           properties:
   *             count:
   *               type: number
   *     security:
   *        - jwt_token: [ ]
   */
  @Delete('/:id')
  @UseBefore(IsLogged, Authorize(LanguageRights.DELETE))
  async delete( @Param('id') id: string) {
    const result = await this.languagesService.remove(id);
    return { count: result };
  }

  /**
   * @swagger
   * /api/languages/{id}:
   *   get:
   *     description: Gets a language by its identifier.
   *     operationId: getById
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: id
   *         in: path
   *         description: The lang resource identifier.
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: The created object.
   *         schema:
   *           $ref: '#/definitions/LanguageModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Get('/:id')
  @UseBefore(IsLogged, Authorize(LanguageRights.READ, LanguageRights.UPDATE))
  async getById( @Param('id') id: string) {
    return this.languagesService.get(id, { fields: { resources: 0 } });
  }

  /**
   * @swagger
   * /api/languages/{langId}/resources:
   *   get:
   *     description: Returns the list of translation resource for a specific language.
   *     operationId: getResources
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: langId
   *         in: path
   *         description: The lang identifier for the requested translation.
   *         required: true
   *         type: string
   *       - name: search
   *         in: query
   *         description: Value to search.
   *         required: false
   *         type: string
   *       - name: sort
   *         in: query
   *         description: Sort column order.
   *         required: false
   *         type: string
   *       - name: page
   *         in: query
   *         description: Current page.
   *         required: false
   *         type: number
   *       - name: limit
   *         in: query
   *         description: Number of page element.
   *         required: false
   *         type: number
   *     responses:
   *       200:
   *         description: list of key/value translation.
   *         schema:
   *           type: array
   *           items:
   *              $ref: '#/definitions/LanguageResourceModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Get('/:langId/resources')
  @UseBefore(IsLogged, Authorize(...LanguageResourceRights.ALL))
  async getResources(
    @Param('langId') langId: string,
    @QueryParam('search') search: string,
    @QueryParam('sort') sort: string,
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number
    ): Promise<LanguageResourceModel[]> {
    const filter = this.getResourceListFilter(search);
    return this.languagesService.getResources(langId, filter, { sort, page, limit });
  }

  /**
   * @swagger
   * /api/languages/{langId}/resources/count:
   *   get:
   *     description: Returns the number of languages resources.
   *     operationId: countResources
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: langId
   *         in: path
   *         description: The lang identifier for the requested translation.
   *         required: true
   *         type: string
   *       - name: search
   *         in: query
   *         description: Value to search.
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: number of languages resources.
   *         schema:
   *           type: object
   *           properties:
   *             count:
   *               type: number
   *     security:
   *        - jwt_token: [ ]
   */
  @Get('/:langId/resources/count')
  @UseBefore(IsLogged, Authorize(...LanguageResourceRights.ALL))
  async countResources(
    @Param('langId') langId: string,
    @QueryParam('search') search: string
    ): Promise<{ count: number }> {
    const filter = this.getResourceListFilter(search);
    const count = await this.languagesService.countResources(langId, filter);
    return { count: count };
  }

  /**
   * @swagger
   * /api/languages/{langId}/resources:
   *   post:
   *     description: Create a new language resource.
   *     operationId: createResource
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: langId
   *         in: path
   *         description: The lang identifier for the requested translation.
   *         required: true
   *         type: string
   *       - name: LanguageResourceModel
   *         in: body
   *         description: The languages resource model.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/LanguageResourceModel'
   *     responses:
   *       200:
   *         description: The created object.
   *         schema:
   *           $ref: '#/definitions/LanguageResourceModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Post('/:langId/resources')
  @UseBefore(IsLogged, Authorize(LanguageResourceRights.CREATE))
  async createResource(
    @Param('langId') langId: string,
    @Body({ required: true }) data: LanguageResourceModel
    ) {
    return this.languagesService.saveResource(langId, data);
  }

  /**
   * @swagger
   * /api/languages/{langId}/resources/{id}:
   *   put:
   *     description: Update a language resource.
   *     operationId: updateResource
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: langId
   *         in: path
   *         description: The lang identifier for the requested translation.
   *         required: true
   *         type: string
   *       - name: id
   *         in: path
   *         description: The lang resource identifier.
   *         required: true
   *         type: string
   *       - name: LanguageResourceModel
   *         in: body
   *         description: The languages resource model.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/LanguageResourceModel'
   *     responses:
   *       200:
   *         description: The created object.
   *         schema:
   *           $ref: '#/definitions/LanguageResourceModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Put('/:langId/resources/:id')
  @UseBefore(IsLogged, Authorize(LanguageResourceRights.UPDATE))
  async updateResource(
    @Param('langId') langId: string,
    @Param('id') id: string,
    @Body({ required: true }) data: LanguageResourceModel
    ) {
    return this.languagesService.saveResource(langId, data);
  }

  /**
   * @swagger
   * /api/languages/{langId}/resources/{id}:
   *   delete:
   *     description: Delete a languages resource.
   *     operationId: deleteResource
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: langId
   *         in: path
   *         description: The lang identifier for the requested translation.
   *         required: true
   *         type: string
   *       - name: id
   *         in: path
   *         description: The lang resource identifier.
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: number of languages resources deleted.
   *         schema:
   *           type: object
   *           properties:
   *             count:
   *               type: number
   *     security:
   *        - jwt_token: [ ]
   */
  @Delete('/:langId/resources/:id')
  @UseBefore(IsLogged, Authorize(LanguageResourceRights.DELETE))
  async deleteResource(
    @Param('langId') langId: string,
    @Param('id') id: string
    ) {
    const result = await this.languagesService.removeResource(langId, id);
    return { count: result };
  }

  /**
   * @swagger
   * /api/languages/{culture}/display:
   *   get:
   *     description: Returns the list of translation key/value for a specific language.
   *     operationId: getLanguage
   *     tags:
   *       - Languages
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: culture
   *         in: path
   *         description: The language culture for the requested translation.
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: list of key/value translation.
   *         schema:
   *           type: array
   *           items:
   *              $ref: '#/definitions/LanguageResourceModel'
   */
  @Get('/:culture/display')
  async getLanguage( @Param('culture') culture: string): Promise<LanguageResourceModel[]> {
    return this.languagesService.displayResources(culture);
  }
}
