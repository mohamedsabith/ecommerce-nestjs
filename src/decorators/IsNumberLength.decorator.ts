import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNumberLength', async: false })
export class IsNumberLengthConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const length = args.constraints[0];
    if (typeof value === 'number') {
      const stringValue = value.toString();
      return stringValue.length === length;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const length = args.constraints[0];
    return `The field "${args.property}" must be a number with exactly ${length} digits.`;
  }
}

export function IsNumberLength(
  length: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [length],
      validator: IsNumberLengthConstraint,
    });
  };
}
