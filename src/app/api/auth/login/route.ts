import { NextRequest, NextResponse } from 'next/server';
import { isDev } from '@/config/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiUrl = isDev ? 'http://localhost:5000/api/auth/register' : '/api/auth/register';
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}