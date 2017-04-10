import { MongoModelBase } from '../../core/MongoModelBase';
import { FacebookModel, GoogleModel, LocalModel, TwitterModel } from './providers';

/**
 * @swagger
 * definitions:
 *   UserModel:
 *     type: object
 *     required:
 *       - id
 *       - email
 *       - firstname
 *       - lastname
 *     properties:
 *       id:
 *         type: string
 *       email:
 *         type: string
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       refresh:
 *         type: string
 *       local:
 *         $ref: '#/definitions/LocalModel'
 *       facebook:
 *         $ref: '#/definitions/FacebookModel'
 *       twitter:
 *         $ref: '#/definitions/TwitterModel'
 *       google:
 *         $ref: '#/definitions/GoogleModel'
 *       rights:
 *           type: array
 *           items:
 *              type: string
 */
export class UserModel extends MongoModelBase {
  email: string;
  firstname: string;
  lastname: string;
  civility: number;
  refresh?: string;
  isSystem?: boolean;
  providers: {
    local?: LocalModel;
    facebook?: FacebookModel;
    twitter?: TwitterModel;
    google?: GoogleModel;
  };
  rights?: string[];
  birthdate?: Date;
  address?: any;
  phone?: string;
  mobile?: string;
}
