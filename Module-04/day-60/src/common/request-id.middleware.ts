import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { requestContext } from './request-context.js';

export interface AppRequest extends Request {
  requestId?: string;
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: AppRequest, res: Response, next: NextFunction): void {
    const incoming = req.header('x-request-id');
    const requestId =
      incoming && incoming.trim().length > 0 ? incoming.trim() : randomUUID();

    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    requestContext.run({ requestId }, () => {
      next();
    });
  }
}