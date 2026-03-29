import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('CLOCK-IN ROUTE - GET method called');
  return NextResponse.json({ 
    message: 'Clock-in endpoint is working. Use POST method to clock in.',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  console.log('CLOCK-IN ROUTE - POST method called');
  
  try {
    const body = await request.json();
    console.log('CLOCK-IN ROUTE - Request body:', body);
    
    const token = request.headers.get('Authorization');
    console.log('CLOCK-IN ROUTE - Token:', token);
    
    // Call backend API
    const response = await fetch('http://localhost:5000/api/work/time-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body),
    });
    
    console.log('CLOCK-IN ROUTE - Backend response status:', response.status);
    const data = await response.json();
    console.log('CLOCK-IN ROUTE - Backend response data:', data);
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('CLOCK-IN ROUTE - Error:', error);
    return NextResponse.json(
      { message: 'Clock in failed', error: error.message },
      { status: 500 }
    );
  }
}