import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

const ALLOWED_AREAS = ['bole', 'kazanchis', 'piassa'] as const;
type AllowedArea = (typeof ALLOWED_AREAS)[number];

@Injectable()
export class ParseAreaPipe
  implements PipeTransform<string | undefined, AllowedArea | undefined>
{
  transform(
    value: string | undefined,
    _metadata: ArgumentMetadata,
  ): AllowedArea | undefined {
    if (value === undefined || value.trim() === '') {
      return undefined;
    }

    const normalized = value.trim().toLowerCase();
    if ((ALLOWED_AREAS as readonly string[]).includes(normalized)) {
      return normalized as AllowedArea;
    }

    throw new BadRequestException(
      `Invalid area "${value}". Allowed areas: ${ALLOWED_AREAS.join(', ')}.`,
    );
  }
}