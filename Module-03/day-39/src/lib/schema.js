
import { z } from 'zod';

export const orderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  phone: z.string().min(9, 'Please enter a valid phone number'),
  dishId: z.string().min(1, 'Please select a dish'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
});