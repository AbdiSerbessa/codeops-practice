import { describe, expect, it } from 'vitest';
import type { AuthenticatedUser } from '../auth/jwt.strategy.js';
import type { Order } from './order.entity.js';
import { OrderPolicy } from './order.policy.js';

describe('OrderPolicy', () => {
  const policy = new OrderPolicy();

  const customer1: AuthenticatedUser = { id: 'user-customer-1', email: 'c1@test.et', roles: ['customer'] };
  const customer2: AuthenticatedUser = { id: 'user-customer-2', email: 'c2@test.et', roles: ['customer'] };
  const courier1: AuthenticatedUser = { id: 'user-courier-1', email: 'cr1@test.et', roles: ['courier'] };
  const staff: AuthenticatedUser = { id: 'user-staff-1', email: 'st@test.et', roles: ['staff'] };

  const pendingOrder: Order = {
    id: 'order-1',
    customerId: 'user-customer-1',
    courierId: 'user-courier-1',
    restaurantId: 'rest-1',
    item: 'Beyaynetu',
    status: 'pending',
  };

  const deliveredOrder: Order = { ...pendingOrder, id: 'order-2', status: 'delivered' };

  it('refuses a stranger customer from reading another customer order', () => {
    expect(policy.can(customer2, pendingOrder, 'read')).toBe(false);
  });

  it('refuses a customer from cancelling an already delivered order', () => {
    expect(policy.can(customer1, deliveredOrder, 'cancel')).toBe(false);
  });

  it('refuses a customer from updating delivery status', () => {
    expect(policy.can(customer1, pendingOrder, 'updateStatus')).toBe(false);
  });

  it('refuses a courier from cancelling an order', () => {
    expect(policy.can(courier1, pendingOrder, 'cancel')).toBe(false);
  });

  it('refuses an unassigned courier from updating order status', () => {
    const otherCourier: AuthenticatedUser = { id: 'user-courier-99', email: 'cr99@test.et', roles: ['courier'] };
    expect(policy.can(otherCourier, pendingOrder, 'updateStatus')).toBe(false);
  });

  it('allows staff to bypass restrictions for any action', () => {
    expect(policy.can(staff, deliveredOrder, 'cancel')).toBe(true);
    expect(policy.can(staff, deliveredOrder, 'updateStatus')).toBe(true);
  });
});