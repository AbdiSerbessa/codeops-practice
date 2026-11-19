import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestStore {
  requestId: string;
}

export const requestContext = new AsyncLocalStorage<RequestStore>();

export function getCurrentRequestId(): string {
  return requestContext.getStore()?.requestId ?? 'system';
}