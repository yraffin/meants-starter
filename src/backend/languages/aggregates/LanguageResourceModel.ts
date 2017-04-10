import { MinLength, MaxLength } from 'class-validator';
import { MongoModelBase } from '../../core/MongoModelBase';

/**
 * @swagger
 * definitions:
 *   LanguageResourceModel:
 *     type: object
 *     required:
 *       - key
 *     properties:
 *       id:
 *         type: string
 *       key:
 *         type: string
 *       value:
 *         type: string
 */
export class LanguageResourceModel extends MongoModelBase {
  @MinLength(2)
  @MaxLength(50)
  key: string;
  value: string;
}
