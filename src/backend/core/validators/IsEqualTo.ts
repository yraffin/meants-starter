import {
  registerDecorator, ValidationOptions, ValidatorConstraint,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator';

/**
 * Represents a validator  constraint
 * @class
 */
@ValidatorConstraint({ name: 'isEqualTo', async: false })
export class IsEqualToConstraint implements ValidatorConstraintInterface {

  /**
   * Called to validate a property value.
   * @method
   * @param {any} value The current property value to validate.
   * @param {ValidationArguments} args The context validation arguments.
   * @returns {boolean}
   */
  validate(value: any, args: ValidationArguments) {
    const property = args.constraints[0];
    if (!property) {
      return false;
    }

    if (!args.object.hasOwnProperty(property)) {
      return false;
    }

    return value === args.object[property];
  }

  defaultMessage(args: ValidationArguments) {
    return `'${args.property}' is not equal to '${args.constraints[0]}'`;
  }

}

/**
 * Represents the 'IsEqualTo' validation annotation.
 * @method
 * @param {string} property The property used to check equality.
 * @param {ValidationOptions} validationOptions The validation options.
 * @returns {Function}
 */
export function IsEqualTo(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsEqualToConstraint
    });
  };
}
