import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

// Access the shared in-memory user store
if (!globalThis.usersDb) {
  globalThis.usersDb = [
    {
      id: '1',
      name: 'Abebe Bikila',
      email: 'abebe@example.com',
      password: 'Password123',
      phone: '0911223344',
      role: 'user',
    },
  ];
}
const usersDb = globalThis.usersDb;

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const inputEmail = email.toLowerCase().trim();
    const user = usersDb.find((u) => u.email.toLowerCase() === inputEmail);

    if (!user) {
      return NextResponse.json(
        { message: 'User does not exist with this email address.' },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid password. Please try again.' },
        { status: 401 }
      );
    }

    // Determine role (assign staff role if email contains 'staff' or is flagged as staff)
    const isStaff = user.role === 'staff' || inputEmail.includes('staff');
    const sessionData = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: isStaff ? 'staff' : 'user',
    };

    // Create session cookie using the updated session helper
    await createSession(sessionData);

    return NextResponse.json(
      { success: true, message: 'Logged in successfully!', user: sessionData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signin API error:', error);
    return NextResponse.json(
      { message: 'Internal server error during sign in.' },
      { status: 500 }
    );
  }
}