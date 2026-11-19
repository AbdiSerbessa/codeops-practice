// src/common/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator.js';
import type { AppRequest } from './request-id.middleware.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<AppRequest>();
    const role = req.header('x-role') ?? req.user?.role;

    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException(
        `Access requires one of the following roles: ${requiredRoles.join(', ')}.`,
      );
    }

    return true;
  }
}