import { ObjectID } from 'mongodb';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

import { MongoModelBase } from '../../core/MongoModelBase';

/**
 * @swagger
 * definitions:
 *   LanguageModel:
 *     type: object
 *     required:
 *       - name
 *       - culture
 *     properties:
 *       name:
 *         type: string
 *       flag:
 *         type: string
 *       culture:
 *         type: string
 *       resources:
 *         type: array
 *         items:
 *            type: string
 */
export class LanguageModel extends MongoModelBase {
  @MinLength(5)
  name: string;

  @IsNotEmpty()
  flag: string;

  @MinLength(2)
  @MaxLength(5)
  culture: string;

  resources: ObjectID[];
}
