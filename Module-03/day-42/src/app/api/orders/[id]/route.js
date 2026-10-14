// src/app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request, { params }) {
  const session = await getSession();

  // 1. Unauthenticated check
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Mock order record
  const mockOrder = {
    id: id,
    userId: 'user_123', // Owner ID
    customerName: 'Abebe Bikila',
    status: 'Preparing',
    totalAmount: 920,
  };

  // 2. Ownership check: User can only read their own account's order (unless staff)[cite: 13]
  const isOwner = mockOrder.userId === session.userId;
  const isStaff = session.role === 'staff';

  if (!isOwner && !isStaff) {
    return NextResponse.json(
      { error: "Forbidden: You cannot view another account's order" },
      { status: 403 }
    );
  }

  return NextResponse.json(mockOrder);
}