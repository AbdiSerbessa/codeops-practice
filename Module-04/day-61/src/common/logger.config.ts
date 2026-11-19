import type { Params } from 'nestjs-pino';

const isProduction = process.env.NODE_ENV === 'production';

export const loggerConfig: Params = {
  pinoHttp: {
    level: process.env.LOG_LEVEL || 'info',
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers["x-api-key"]',
        'authorization',
        'password',
        'passwordHash',
        'refreshHash',
        'refreshToken',
        'accessToken',
        'phone',
        'customerPhone',
        '*.password',
        '*.passwordHash',
        '*.refreshHash',
        '*.refreshToken',
        '*.accessToken',
        '*.phone',
        '*.customerPhone',
      ],
      censor: '[REDACTED]',
    },
    transport: !isProduction
      ? {
          target: 'pino-pretty',
          options: { singleLine: true },
        }
      : undefined,
  },
};