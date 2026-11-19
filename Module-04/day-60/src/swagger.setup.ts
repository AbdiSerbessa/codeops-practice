import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Addis Eats Orders API')
    .setDescription(
      'Order management API with structured JSON logging, request correlation IDs, API key protection, and interactive ordering via Swagger.',
    )
    .setVersion('1.0')
    .addTag('Orders', 'Order listing, lookup, creation, and timeout endpoints')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API key required for protected routes',
      },
      'api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Export OpenAPI specification to disk
  writeFileSync(
    resolve(process.cwd(), 'openapi.json'),
    JSON.stringify(document, null, 2),
    'utf8',
  );

  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('docs', app, document);
  }
}