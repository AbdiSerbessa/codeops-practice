import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import type { Page } from '../common/page.js';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import type { Order } from './order.types.js';
import { OrdersService } from './orders.service.js';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('orders')
  findAll(@Query() query: FindOrdersQueryDto): Page<Order> {
    return this.ordersService.findAll({
      status: query.status,
      area: query.area,
      limit: query.limit,
      offset: query.offset,
      sort: query.sort,
    });
  }

  // Static route MUST appear above any dynamic :id route
  @Get('orders/pending')
  findPending(): Page<Order> {
    return this.ordersService.findPending();
  }

  @Get('restaurants/:id/orders')
  findByRestaurant(
    @Param('id', ParseIntPipe) id: number,
  ): Page<Order> {
    return this.ordersService.findByRestaurantId(id);
  }

  @Patch('orders/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ): Order {
    return this.ordersService.updateStatus(id, dto.status);
  }

  @Delete('orders/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.ordersService.delete(id);
  }
}