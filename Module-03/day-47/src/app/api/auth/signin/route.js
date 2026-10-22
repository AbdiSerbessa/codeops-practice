// src/app/api/auth/signin/route.js
import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export async function POST(request) {
  const { email } = await request.json();

  // Assign staff role if email contains 'staff', otherwise regular user
  const isStaff = email.includes('staff');

  const sessionData = {
    userId: isStaff ? 'staff_77' : 'user_123',
    email: email,
    role: isStaff ? 'staff' : 'user',
  };

  await createSession(sessionData);

  return NextResponse.json({ success: true, user: sessionData });
}