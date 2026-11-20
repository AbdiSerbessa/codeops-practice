import type { AuthenticatedUser } from '../auth/jwt.strategy.js';
import type { Order } from './order.entity.js';

export type OrderAction = 'read' | 'cancel' | 'updateStatus'| 'delete';

export function assertNever(value: never): never {
  throw new Error(`Unhandled order action: ${String(value)}`);
}

export class OrderPolicy {
  can(user: AuthenticatedUser | undefined, order: Order, action: OrderAction): boolean {
    if (!user) {
      return false;
    }

    if (user.roles.includes('staff')) {
      return true;
    }

    switch (action) {
      case 'read':
        return (
          order.customerId === user.id ||
          (order.courierId !== undefined && order.courierId === user.id)
        );
      case 'cancel':
        return (
          order.customerId === user.id &&
          (order.status === 'pending' || order.status === 'preparing')
        );
      case 'updateStatus':
        return (
          user.roles.includes('courier') &&
          order.courierId !== undefined &&
          order.courierId === user.id
        );
        case 'delete':
        return user.roles.includes('admin');
      default:
        return assertNever(action);
    }
  }
}