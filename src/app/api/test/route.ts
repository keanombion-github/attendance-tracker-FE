import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('TEST ROUTE - GET method called');
  return NextResponse.json({ message: 'Test route working' });
}

export async function POST(request: NextRequest) {
  console.log('TEST ROUTE - POST method called');
  try {
    const body = await request.json();
    console.log('TEST ROUTE - Body:', body);
    return NextResponse.json({ message: 'Test POST working', received: body });
  } catch (error) {
    console.log('TEST ROUTE - Error:', error);
    return NextResponse.json({ error: 'Test POST failed' }, { status: 500 });
  }
}