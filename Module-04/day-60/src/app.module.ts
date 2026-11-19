import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './common/logger.config.js';
import { RequestIdMiddleware } from './common/request-id.middleware.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [LoggerModule.forRoot(loggerConfig), OrdersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}