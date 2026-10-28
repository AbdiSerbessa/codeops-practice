'use server';

import { revalidatePath } from 'next/cache';
import { createOrder, getSession, markCancelled, updateOrderStatus as updateDbOrderStatus } from '@/lib/db';
import { orderSchema } from '@/lib/schema';

export async function placeOrder(prevState, formData) {
  try {
    // 1. Extract cartItems array or fallback to single dishId
    const cartItemsRaw = formData.get('cartItems');
    let dishId = formData.get('dishId');
    let quantity = Number(formData.get('quantity') || 1);
    let parsedCart = [];

    if (cartItemsRaw) {
      try {
        parsedCart = JSON.parse(cartItemsRaw);
        if (parsedCart.length > 0) {
          dishId = parsedCart[0].id || parsedCart[0].dishId;
          quantity = parsedCart[0].quantity || 1;
        }
      } catch (e) {
        console.error('Failed to parse cartItems JSON', e);
      }
    }

    // 2. Compute total amount for all items in the cart
    const totalAmount = parsedCart.length > 0
      ? parsedCart.reduce(
          (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
          0
        )
      : 0;

    const rawData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      dishId: dishId || 'default-dish-id', // Ensures dishId is present for orderSchema validation
      quantity: quantity,
      notes: formData.get('notes'),
    };

    // 3. Validate form data using Zod schema
    const validationResult = orderSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
        message: 'Please fix the errors below.',
      };
    }

    // 4. Get current session user
    const session = await getSession();
    if (!session) {
      return { success: false, message: 'Unauthorized. Please log in.' };
    }

    // 5. Save complete order data (including totalAmount & cartItems) to mock db
    const newOrder = await createOrder({
      ...validationResult.data,
      cartItems: parsedCart,
      totalAmount,
    });

    // 6. Revalidate cache for checkout, cart, and dashboard
    revalidatePath('/checkout');
    revalidatePath('/cart');
    revalidatePath('/dashboard');

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
    revalidatePath('/dashboard');
    revalidatePath(`/track/${orderId}`);
    return { success: true, order: updatedOrder, message: `Order ${orderId} cancelled successfully.` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    // Call centralized db status update
    const updatedOrder = await updateDbOrderStatus(orderId, newStatus);
    
    // Revalidate dashboard and live order tracking page
    revalidatePath('/dashboard');
    revalidatePath(`/track/${orderId}`);

    return { success: true, order: updatedOrder, message: `Status updated to ${newStatus}` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export const submitOrderAction = placeOrder;
export const cancelOrderAction = cancelOrder;