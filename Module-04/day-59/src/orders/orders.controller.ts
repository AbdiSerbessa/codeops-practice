import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ParseAreaPipe } from '../common/parse-area.pipe.js';
import { Roles } from '../common/roles.decorator.js';
import { OrdersService, type OrderSummary } from './orders.service.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query('area', ParseAreaPipe) area?: string): OrderSummary[] {
    return this.ordersService.findAll(area);
  }

  @Get('staff-queue')
  @Roles('staff')
  getStaffQueue(): OrderSummary[] {
    return this.ordersService.findAll();
  }

  @Get('slow')
  getSlowReport(): Promise<{ status: string; delayMs: number }> {
    return this.ordersService.slowReport();
  }

  @Post()
  create(
    @Body() body: { restaurant: string; area: string; totalSantim: number },
  ): OrderSummary {
    return this.ordersService.create(body);
  }
}