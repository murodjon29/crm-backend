import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
  } from 'class-validator';

  export function IsCustomEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isCustomEmail',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, _args: ValidationArguments): boolean {
            if (typeof value !== 'string') return false;
  
            const emailRegex =
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
            return emailRegex.test(value);
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} noto'g'ri formatda. To'g'ri e-mail manzil kiriting, masalan: test@example.com`;
          },
        },
      });
    };
  }
  