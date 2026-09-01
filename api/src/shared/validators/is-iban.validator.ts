import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidIban } from '../utils/iban/iban.util';

@ValidatorConstraint({ name: 'isIban', async: false })
class IsIbanConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isValidIban(value);
  }

  defaultMessage(): string {
    return 'iban must be a valid IBAN';
  }
}

export function IsIban(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIbanConstraint,
    });
  };
}
