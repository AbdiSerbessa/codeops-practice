import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

// Initialize global in-memory database
if (!globalThis.usersDb) {
  globalThis.usersDb = [];
}
const usersDb = globalThis.usersDb;

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