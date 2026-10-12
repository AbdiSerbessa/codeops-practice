// src/app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;

  // In a real application, you would query your database using the order id
  // Returning mock live data for the polling screen:
  const mockOrder = {
    id,
    status: 'Preparing', // Could cycle or update based on elapsed time in real DB
    customerName: 'Abebe Bikila',
    totalPrice: 920,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(mockOrder);
}