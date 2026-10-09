import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const dishes = await db.dish.findMany();
    return NextResponse.json(dishes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dishes' },
      { status: 500 }
    );
  }
}