// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { orderSchema } from '@/lib/schema';
import { createOrder, db } from '@/lib/db';

// POST: Save a new order placed during checkout
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate request payload with Zod
    const result = orderSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors }, 
        { status: 422 }
      );
    }

    // Persist order directly into mock DB memory
    const newOrder = await createOrder(result.data);

    return NextResponse.json(
      { message: 'Order placed successfully!', order: newOrder }, 
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request payload' }, 
      { status: 400 }
    );
  }
}

// GET: Retrieve all orders for the Admin Dashboard
export async function GET() {
  try {
    const orders = await db.order.findMany();
    
    // Sort orders to show newest first
    const sortedOrders = [...orders].reverse();

    return NextResponse.json(sortedOrders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' }, 
      { status: 500 }
    );
  }
}