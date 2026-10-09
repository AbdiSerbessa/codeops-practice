import { NextResponse } from 'next/server';
import { orderSchema } from '@/lib/schema';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate with Zod
    const result = orderSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors }, 
        { status: 422 }
      );
    }

    // Process successful order (mock persistence)
    const newOrder = {
      id: Date.now(),
      ...result.data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

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