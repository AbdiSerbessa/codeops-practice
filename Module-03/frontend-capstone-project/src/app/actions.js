'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createOrder, getSession, markCancelled, updateOrderStatus as updateDbOrderStatus, verifyUserPassword } from '@/lib/db';
import { orderSchema } from '@/lib/schema';

export async function placeOrder(prevState, formData) {
  try {
    const cookieStore = await cookies();
    
    // 1. Dynamically extract active session email
    let activeEmail = '';
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      const val = cookie.value;
      if (!val) continue;

      if (val.includes('@') && !val.includes('{')) {
        activeEmail = val.trim();
        break;
      }

      try {
        const parsed = JSON.parse(val);
        if (parsed.email) {
          activeEmail = parsed.email.trim();
          break;
        }
        if (parsed.user?.email) {
          activeEmail = parsed.user.email.trim();
          break;
        }
      } catch (e) {
        // Skip non-JSON cookies
      }
    }

    const submittedEmail = (formData.get('email') || '').toString().trim().toLowerCase();
    const submittedPassword = (formData.get('password') || '').toString().trim();

    const sessionEmail = (activeEmail || submittedEmail).toLowerCase();

    const errors = {};

    // 2. Strict Account Binding: Submitted email must match logged-in account
    if (activeEmail && submittedEmail !== sessionEmail) {
      errors.email = [`Must match your active logged-in account email (${sessionEmail}).`];
    }

    // 3. True Password Verification against Database Record
    if (!submittedPassword) {
      errors.password = ['Password is required for account verification.'];
    } else {
      const isValidPassword = await verifyUserPassword(sessionEmail, submittedPassword);
      if (!isValidPassword) {
        errors.password = ['Incorrect password. Please enter the valid password for your account (e.g., Br786778).'];
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Security validation failed: Invalid credentials provided.',
        errors,
      };
    }

    // 4. Process Cart & Order Items
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

    const totalAmount = parsedCart.length > 0
      ? parsedCart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
      : 0;

    const rawData = {
      name: submittedEmail.split('@')[0] || 'Valued Customer',
      phone: '0943350427',
      dishId: dishId || 'default-dish-id',
      quantity: quantity,
      notes: formData.get('notes'),
    };

    const validationResult = orderSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
        message: 'Please fix the errors below.',
      };
    }

    const newOrder = await createOrder({
      ...validationResult.data,
      email: submittedEmail,
      userId: sessionEmail,
      cartItems: parsedCart,
      totalAmount,
    });

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
    const updatedOrder = await updateDbOrderStatus(orderId, newStatus);
    revalidatePath('/dashboard');
    revalidatePath(`/track/${orderId}`);
    return { success: true, order: updatedOrder, message: `Status updated to ${newStatus}` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export const submitOrderAction = placeOrder;
export const cancelOrderAction = cancelOrder;