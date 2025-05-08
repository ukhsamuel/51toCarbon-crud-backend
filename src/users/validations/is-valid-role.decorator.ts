import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { UserRoleEnum } from '../../utils/enums/roles.enum';

export function IsValidRole(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidRole',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Object.values(UserRoleEnum).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid role: ${Object.values(UserRoleEnum).join(', ')}`;
        },
      },
    });
  };
}
