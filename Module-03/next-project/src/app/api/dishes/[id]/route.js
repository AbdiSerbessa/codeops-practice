import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const dish = await db.dish.findUnique({ where: { id } });

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    return NextResponse.json(dish, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dish details' },
      { status: 500 }
    );
  }
}