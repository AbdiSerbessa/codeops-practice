import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AppRequest } from './request-id.middleware.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AppRequest>();
    const expectedKey = process.env.API_KEY ?? 'dev-secret-key';
    const providedKey = req.header('x-api-key');

    if (!providedKey || providedKey.trim().length === 0) {
      throw new UnauthorizedException('Missing x-api-key header.');
    }

    if (providedKey !== expectedKey) {
      throw new ForbiddenException('Invalid API key.');
    }

    return true;
  }
}