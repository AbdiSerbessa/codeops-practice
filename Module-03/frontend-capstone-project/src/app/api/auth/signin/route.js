import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

// Ensure shared global dbStore exists and holds user records
global.dbStore = global.dbStore || {};
global.dbStore.users = global.dbStore.users || [
  {
    id: 'user_abdi_19',
    name: 'Abdi Serbessa',
    email: 'abdiserbessa19@gmail.com',
    password: 'Ab094335',
    role: 'user',
    phone: '0943350427',
  },
  {
    id: '1',
    name: 'Abebe Bikila',
    email: 'abebe@example.com',
    password: 'Password123',
    phone: '0911223344',
    role: 'staff',
  },
];

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
    const usersDb = global.dbStore.users;
    const user = usersDb.find((u) => u.email.toLowerCase() === inputEmail);

    // STRICT CHECK: Reject if user does not exist in store
    if (!user) {
      return NextResponse.json(
        { message: 'Account not found. Please register first.' },
        { status: 401 }
      );
    }

    // Verify password against stored user record
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid password. Please try again.' },
        { status: 401 }
      );
    }

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