import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import type { RequestWithId } from '../request-id.middleware.js';

export interface ErrorEnvelope {
  code: string;
  message: string;
  path: string;
  timestamp: string;
  requestId: string;
}

const STATUS_CODE_MAP: Record<number, string> = {
  400: 'VALIDATION_ERROR',
  404: 'RESOURCE_NOT_FOUND',
  409: 'STATE_CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  500: 'INTERNAL_SERVER_ERROR',
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<RequestWithId>();

    const { status, code, message } = this.translate(exception);

    if (status >= 500) {
      this.logger.error(
        `[${req.requestId ?? 'no-req-id'}] ${req.method} ${req.url} -> ${status}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const body: ErrorEnvelope = {
      code,
      message,
      path: req.originalUrl || req.url,
      timestamp: new Date().toISOString(),
      requestId: req.requestId ?? 'unknown',
    };

    res.status(status).json(body);
  }

  private translate(exception: unknown): {
    status: number;
    code: string;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();
      const code = STATUS_CODE_MAP[status] ?? `HTTP_${status}`;

      if (typeof raw === 'string') {
        return { status, code, message: raw };
      }

      if (typeof raw === 'object' && raw !== null && 'message' in raw) {
        const msg = (raw as { message: unknown }).message;
        const formatted = Array.isArray(msg) ? msg.join('; ') : String(msg);
        return { status, code, message: formatted };
      }

      return { status, code, message: exception.message };
    }

    // Any unexpected runtime error (e.g., TypeError) becomes a safe generic 500
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal error occurred. Please try again later.',
    };
  }
}