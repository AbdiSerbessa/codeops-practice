// src/orders/orders.controller.ts
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
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Page } from '../common/page.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import type { Order } from './order.types.js';
import { OrdersService } from './orders.service.js';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('orders')
  findAll(@Query() query: FindOrdersQueryDto): Page<Partial<Order>> {
    return this.ordersService.findAll(query);
  }

  @Get('orders/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Order {
    return this.ordersService.findOne(id);
  }

  @Get('restaurants/:id/orders')
  findByRestaurant(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: FindOrdersQueryDto,
  ): Page<Partial<Order>> {
    return this.ordersService.findByRestaurant(id, query);
  }

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateOrderDto,
    @Res({ passthrough: true }) res: Response,
  ): Order {
    const created = this.ordersService.create(dto);
    res.setHeader('Location', `/api/v1/orders/${created.id}`);
    return created;
  }

  @Patch('orders/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ): Order {
    return this.ordersService.updateStatus(id, dto.status);
  }

  @Delete('orders/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.ordersService.delete(id);
  }
}