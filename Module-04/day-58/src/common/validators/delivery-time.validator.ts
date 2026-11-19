import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';

/**
 * Cross-field rule: When `deliveryMode === 'SCHEDULED'`, `scheduledAt` is required
 * and must be a valid ISO timestamp in the future; when `deliveryMode === 'ASAP'`,
 * `scheduledAt` must not be set.
 * Attached to `scheduledAt` because `deliveryMode` selects the mode while `scheduledAt`
 * is the specific timestamp field the customer must supply or clear to fix the conflict.
 */
export function IsValidScheduleForMode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidScheduleForMode',
      target: object.constructor,
      propertyName,
      options: {
        message:
          'scheduledAt is required (and must be in the future) when deliveryMode is SCHEDULED, and must be omitted when deliveryMode is ASAP.',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const obj = args.object as { deliveryMode?: string };
          if (obj.deliveryMode === 'SCHEDULED') {
            if (typeof value !== 'string') return false;
            const parsed = Date.parse(value);
            return !Number.isNaN(parsed) && parsed > Date.now();
          }
          return value === undefined || value === null;
        },
      },
    });
  };
}