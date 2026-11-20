// src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../auth/jwt.strategy.js';
import { Roles } from '../auth/roles.decorator.js';
import { CheckPolicy } from './check-policy.decorator.js';
import type { Order, OrderStatus } from './order.entity.js';
import { OrderPolicyGuard } from './order-policy.guard.js';
import { ORDERS_REPOSITORY, type OrdersRepository } from './orders.repository.js';

@ApiTags('Orders')
@ApiBearerAuth('bearer')
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepo: OrdersRepository,
  ) {}

  @Get()
  async findAll(@Req() req: { user: AuthenticatedUser }): Promise<Order[]> {
    const all = await this.ordersRepo.findAll();
    const user = req.user;

    if (user.roles.includes('staff') || user.roles.includes('admin')) {
      return all;
    }
    if (user.roles.includes('courier')) {
      return all.filter((o) => o.courierId === user.id);
    }
    return all.filter((o) => o.customerId === user.id);
  }

  @Post()
  @Roles('customer', 'staff')
  async create(
    @Req() req: { user: AuthenticatedUser },
    @Body() body: { restaurantId: string; item: string },
  ): Promise<Order> {
    return this.ordersRepo.create({
      id: randomUUID(),
      customerId: req.user.id,
      restaurantId: body.restaurantId,
      item: body.item,
      status: 'pending',
    });
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<void> {
    await this.ordersRepo.delete(id);
  }

  @Get(':id')
  @UseGuards(OrderPolicyGuard)
  @CheckPolicy('read')
  findOne(@Req() req: { order: Order }): Order {
    return req.order;
  }

  @Patch(':id/cancel')
  @Roles('customer', 'staff')
  @UseGuards(OrderPolicyGuard)
  @CheckPolicy('cancel')
  cancel(@Req() req: { order: Order }): Promise<Order> {
    return this.ordersRepo.updateStatus(req.order.id, 'cancelled');
  }

  @Patch(':id/status')
  @Roles('courier', 'staff')
  @UseGuards(OrderPolicyGuard)
  @CheckPolicy('updateStatus')
  updateStatus(
    @Param('id') _id: string,
    @Req() req: { order: Order },
    @Body() body: { status: OrderStatus },
  ): Promise<Order> {
    return this.ordersRepo.updateStatus(req.order.id, body.status);
  }
}