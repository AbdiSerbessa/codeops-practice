import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().regex(/^(\+251|0)[97]\d{8}$/, 'Enter a valid Ethiopian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});