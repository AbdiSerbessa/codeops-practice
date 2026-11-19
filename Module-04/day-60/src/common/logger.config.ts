import type { Params } from 'nestjs-pino';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { getCurrentRequestId } from './request-context.js';

const isProduction = process.env.NODE_ENV === 'production';

export const loggerConfig: Params = {
  pinoHttp: {
    level: process.env.LOG_LEVEL || 'info',
    customProps: (req: IncomingMessage) => {
      const headerId = req.headers['x-request-id'];
      const requestId =
        typeof headerId === 'string' && headerId.trim().length > 0
          ? headerId.trim()
          : getCurrentRequestId();
      return { requestId };
    },
    serializers: {
      req(req: IncomingMessage & { body?: unknown }) {
        return {
          method: req.method,
          url: req.url,
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers["x-api-key"]',
        'authorization',
        'x-api-key',
        'phone',
        'customerPhone',
        'phoneNumber',
        '*.phone',
        '*.customerPhone',
        '*.phoneNumber',
        'body.phone',
        'body.customerPhone',
        'body.phoneNumber',
      ],
      censor: '[REDACTED]',
    },
    transport: !isProduction
      ? {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
};