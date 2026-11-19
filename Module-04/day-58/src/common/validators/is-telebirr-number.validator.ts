import { registerDecorator, type ValidationOptions } from 'class-validator';

// Ethiopian TeleBirr mobile format: +2519XXXXXXXX or 09XXXXXXXX (or 07/2517)
const TELEBIRR_REGEX = /^(?:\+251|0)(?:9|7)\d{8}$/;

export function IsTeleBirrNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTeleBirrNumber',
      target: object.constructor,
      propertyName,
      options: {
        message:
          'customerPhone must be a valid Ethiopian TeleBirr number starting with 09, 07, +2519, or +2517 (10 digits local or +251 followed by 9 digits).',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && TELEBIRR_REGEX.test(value.trim());
        },
      },
    });
  };
}