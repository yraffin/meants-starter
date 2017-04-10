import { IsEmail, ValidateIf, IsNotEmpty, MinLength, MaxLength, IsIn, Validate } from 'class-validator';
import { IsEqualTo } from '../../core/validators';
/**
 * @swagger
 * definitions:
 *   RegisterModel:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       passwordConfirm:
 *         type: string
 *       civility:
 *         type: number
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 */
export class RegisterModel {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  passwordConfirm: string;

  @IsIn([0, 1, 2])
  civility: number;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;
}
