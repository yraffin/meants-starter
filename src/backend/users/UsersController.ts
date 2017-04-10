import { JsonController, Get, Post, Put, Param, QueryParam, Delete, Body, UseBefore, Req } from 'routing-controllers';
import { Service, Inject } from 'typedi';
import { Request } from 'express';
import _ = require('lodash');
import { UserModel, RegisterModel, UsersService, PaginationFilter } from './UsersService';
import { IsLogged, Authorize } from '../config/authentication';
import { UnprocessableEntityError } from '../errors';
import * as Rights from '../core/Rights';

const userFilter = { rights: 0, providers: 0, refresh: 0 };

@Service()
@JsonController('/users')
@UseBefore(IsLogged)
export class UsersController {

  @Inject()
  usersService: UsersService;

  constructor() {
  }

  /**
   * Gets the user list filter by search text.
   * @method
   * @param {string} search The searching terms.
   * @returns The mongo filter.
   */
  private getUserListFilter(search: string) {
    let filter = {} as any;
    if (!search || search.replace(/ /ig, '') === '') {
      return filter;
    }

    filter = {
      '$or': [
        { 'email': new RegExp(search, 'ig') },
        { 'firstname': new RegExp(search, 'ig') },
        { 'lastname': new RegExp(search, 'ig') }
      ]
    };

    return filter;
  }

  /**
   * @swagger
   * /api/users:
   *   get:
   *     description: Returns all users
   *     operationId: getAll
   *     tags:
   *       - Users
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: search
   *         in: query
   *         description: searching terms.
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
   *         description: list of user model
   *         schema:
   *           type: array
   *           items:
   *              $ref: '#/definitions/UserModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Get('/')
  @UseBefore(Authorize(...Rights.UserRights.ALL))
  async getAll(
    @QueryParam('search') search: string,
    @QueryParam('sort') sort: string,
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number
    ): Promise<UserModel[]> {
    const filter = this.getUserListFilter(search);
    return this.usersService.filter(filter, userFilter, { sort, page, limit });
  }

  /**
   * @swagger
   * /api/users/count:
   *   get:
   *     description: Returns the number of users
   *     operationId: count
   *     tags:
   *       - Users
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: search
   *         in: query
   *         description: searching terms.
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: number of user model
   *         schema:
   *           type: object
   *           properties:
   *             count:
   *               type: number
   *     security:
   *        - jwt_token: [ ]
   */
  @Get('/count')
  @UseBefore(Authorize(...Rights.UserRights.ALL))
  async count(
    @QueryParam('search') search: string
    ): Promise<{ count: number }> {
    const filter = this.getUserListFilter(search);
    const count = await this.usersService.count(filter);
    return { count: count };
  }

  /**
   * @swagger
   * /api/users/me:
   *   get:
   *     description: Get a current user
   *     operationId: getCurrent
   *     tags:
   *       - Users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: user model
   *         schema:
   *           $ref: '#/definitions/UserModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Get('/me')
  @UseBefore(Authorize(Rights.UserRights.READ))
  async getCurrent( @Req() request: Request): Promise<UserModel> {
    return this.usersService.get(request.user.id);
  }

  /**
   * @swagger
   * /api/users/rights:
   *   get:
   *     description: Returns the list of rights.
   *     operationId: getRights
   *     tags:
   *       - Users
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
   *         description: list of rights.
   *         schema:
   *           type: object
   */
  @Get('/rights')
  async getRights(): Promise<Object> {
    const result = {};
    Object.keys(Rights).forEach(key => result[key] = Rights[key].ALL);
    return Promise.resolve(result);
  }

  /**
   * @swagger
   * /api/users/{id}/rights:
   *   get:
   *     description: Returns the list of user rights.
   *     operationId: getUserRights
   *     tags:
   *       - Users
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
   *         description: requested user id
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: list of rights.
   *         schema:
   *          type: array
   *          items:
   *            type: string
   */
  @Get('/:id/rights')
  @UseBefore(Authorize(Rights.UserRights.UPDATE))
  async getUserRights( @Param('id') id: string): Promise<string[]> {
    return this.usersService.getUserRights(id);
  }

  /**
   * @swagger
   * /api/users/{id}/rights:
   *   put:
   *     description: Save the list of user rights.
   *     operationId: saveUserRights
   *     tags:
   *       - Users
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
   *         description: requested user id
   *         required: true
   *         type: string
   *       - name: data
   *         in: body
   *         description: user rights list
   *         required: true
   *         schema:
   *            type: array
   *            items:
   *              type: string
   *     responses:
   *       200:
   *         description: list of rights.
   *         schema:
   *          type: array
   *          items:
   *            type: string
   */
  @Put('/:id/rights')
  @UseBefore(Authorize(Rights.UserRights.UPDATE))
  async saveUserRights(
    @Param('id') id: string,
    @Body({ required: true }) data: string[]
    ): Promise<string[]> {
    return this.usersService.saveUserRights(id, data);
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     description: Get a user by its identifier
   *     operationId: getById
   *     tags:
   *       - Users
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: id
   *         in: path
   *         description: requested user id
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: user model
   *         schema:
   *           $ref: '#/definitions/UserModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Get('/:id')
  @UseBefore(Authorize(Rights.UserRights.READ))
  async getById( @Param('id') id: string): Promise<UserModel> {
    return this.usersService.get(id, { fields: userFilter });
  }

  /**
   * @swagger
   * /api/users/:
   *   post:
   *     description: Create a new user.
   *     operationId: create
   *     tags:
   *       - Users
   *     produces:
   *       - application/json
   *       - text/plain
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: JWT token.
   *         required: true
   *         type: string
   *       - name: data
   *         in: body
   *         description: The user model.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/RegisterModel'
   *     responses:
   *       200:
   *         description: The created object.
   *         schema:
   *           $ref: '#/definitions/UserModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Post('/')
  @UseBefore(Authorize(Rights.UserRights.CREATE))
  async create( @Body({ required: true }) data: RegisterModel) {
    return this.usersService.createUser(data);
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     description: Create a new user.
   *     operationId: create
   *     tags:
   *       - Users
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
   *       - name: data
   *         in: body
   *         description: The user model.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/UserModel'
   *     responses:
   *       200:
   *         description: The created object.
   *         schema:
   *           $ref: '#/definitions/UserModel'
   *     security:
   *        - jwt_token: [ ]
   */
  @Put('/:id')
  @UseBefore(Authorize(Rights.UserRights.UPDATE))
  async update(
    @Param('id') id: string,
    @Body({ required: true }) data: UserModel
    ) {
    if (data.id !== id) {
      throw new UnprocessableEntityError('Bad user');
    }

    return this.usersService.save(data);
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     description: Delete new user.
   *     operationId: delete
   *     tags:
   *       - Users
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
   *         description: number of users deleted.
   *         schema:
   *           type: object
   *           properties:
   *             count:
   *               type: number
   *     security:
   *        - jwt_token: [ ]
   */
  @Delete('/:id')
  @UseBefore(Authorize(Rights.UserRights.DELETE))
  async delete( @Param('id') id: string) {
    const result = await this.usersService.removeOne(id);
    return { count: result };
  }
}
