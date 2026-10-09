
'use server';

import { revalidatePath } from 'next/cache';
import { createOrder, getSession, markCancelled } from '@/lib/db';
import { orderSchema } from '@/lib/schema';

export async function placeOrder(prevState, formData) {
  try {
    // 1. Extract form values
    const rawData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      dishId: formData.get('dishId'),
      quantity: Number(formData.get('quantity') || 1),
      notes: formData.get('notes'),
    };

    // 2. Validate using Zod schema
    const validationResult = orderSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
        message: 'Please fix the errors below.',
      };
    }

    // 3. Get current session user
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'Unauthorized. Please log in.' };
    }

    // 4. Save order to mock db
    const newOrder = await createOrder(validationResult.data);

    // 5. Revalidate cache
    revalidatePath('/checkout');
    revalidatePath('/cart');

    return {
      success: true,
      message: `Order successfully placed! Order ID: ${newOrder.id}`,
      order: newOrder,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Something went wrong while placing the order.',
    };
  }
}

export async function cancelOrder(orderId) {
  try {
    const updatedOrder = await markCancelled(orderId);
    revalidatePath('/checkout');
    revalidatePath('/cart');
    return { success: true, order: updatedOrder, message: `Order ${orderId} cancelled successfully.` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Keep backwards compatibility aliases if needed elsewhere in your UI components
export const submitOrderAction = placeOrder;
export const cancelOrderAction = cancelOrder;