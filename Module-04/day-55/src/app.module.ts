import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DishesModule } from './dishes/dishes.module.js';

@Module({
  imports: [DishesModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
