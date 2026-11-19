import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { AppRequest } from './request-id.middleware.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<AppRequest>();
    const startedAt = Date.now();
    const handlerName = context.getHandler().name;
    const requestId = req.requestId ?? 'unknown';

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAt;
          this.logger.log(
            `method=${req.method} path=${req.originalUrl || req.url} handler=${handlerName} outcome=success duration=${durationMs}ms requestId=${requestId}`,
          );
        },
        error: (err: unknown) => {
          const durationMs = Date.now() - startedAt;
          const status =
            err && typeof err === 'object' && 'status' in err
              ? String((err as { status?: unknown }).status)
              : 'error';
          this.logger.warn(
            `method=${req.method} path=${req.originalUrl || req.url} handler=${handlerName} outcome=failure(${status}) duration=${durationMs}ms requestId=${requestId}`,
          );
        },
      }),
    );
  }
}