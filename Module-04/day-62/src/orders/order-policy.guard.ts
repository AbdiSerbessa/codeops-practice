// src/orders/order-policy.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICY_KEY } from './check-policy.decorator.js';
import { type OrderAction, OrderPolicy } from './order.policy.js';
import { ORDERS_REPOSITORY, type OrdersRepository } from './orders.repository.js';

@Injectable()
export class OrderPolicyGuard implements CanActivate {
  private readonly policy = new OrderPolicy();

  constructor(
    private readonly reflector: Reflector,
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepo: OrdersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.getAllAndOverride<OrderAction>(CHECK_POLICY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!action) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const orderId: string | undefined = request.params?.id;
    const order = orderId ? await this.ordersRepo.findById(orderId) : null;

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    request.order = order;

    const user = request.user;
    if (!this.policy.can(user, order, 'read') && !user?.roles?.includes('staff')) {
      throw new NotFoundException('Order not found');
    }

    if (!this.policy.can(user, order, action)) {
      throw new ForbiddenException('You are not allowed to perform this action');
    }

    return true;
  }
}