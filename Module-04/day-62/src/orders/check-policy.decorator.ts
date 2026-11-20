// src/orders/check-policy.decorator.ts
import { SetMetadata } from '@nestjs/common';
import type { OrderAction } from './order.policy.js';

export const CHECK_POLICY_KEY = 'checkPolicy';
export const CheckPolicy = (action: OrderAction) => SetMetadata(CHECK_POLICY_KEY, action);