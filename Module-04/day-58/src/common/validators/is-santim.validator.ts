import { registerDecorator, type ValidationOptions } from 'class-validator';

export function IsSantim(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSantim',
      target: object.constructor,
      propertyName,
      options: {
        message:
          '$property must be a positive whole number in santim (100 santim = 1 ETB, minimum 100 santim).',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'number' && Number.isInteger(value) && value >= 100;
        },
      },
    });
  };
}