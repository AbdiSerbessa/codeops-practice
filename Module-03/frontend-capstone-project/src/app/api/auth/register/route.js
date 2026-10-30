import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

// Ensure shared global dbStore exists and holds user records (matches signin route)
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
const usersDb = global.dbStore.users;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const inputEmail = email.toLowerCase().trim();
    const existingUser = usersDb.find((u) => u.email.toLowerCase() === inputEmail);

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const newUser = {
      id: String(Date.now()),
      name: name.trim(),
      email: inputEmail,
      phone: phone.trim(),
      password,
      role: 'user',
    };

    usersDb.push(newUser);

    // Create session cookie automatically on successful registration
    await createSession({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    return NextResponse.json(
      { success: true, message: 'Account registered successfully!', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration server error detail:', error);
    return NextResponse.json(
      { message: error?.message || 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}