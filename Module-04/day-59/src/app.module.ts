import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiKeyGuard } from './common/api-key.guard.js';
import { LoggingInterceptor } from './common/logging.interceptor.js';
import { RequestIdMiddleware } from './common/request-id.middleware.js';
import { RolesGuard } from './common/roles.guard.js';
import { TimeoutInterceptor } from './common/timeout.interceptor.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [OrdersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}