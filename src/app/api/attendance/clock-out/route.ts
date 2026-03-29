import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('CLOCK-OUT ROUTE - GET method called');
  return NextResponse.json({ 
    message: 'Clock-out endpoint is working. Use POST method to clock out.',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  console.log('CLOCK-OUT ROUTE - POST method called');
  
  try {
    const body = await request.json();
    console.log('CLOCK-OUT ROUTE - Request body:', body);
    
    const token = request.headers.get('Authorization');
    console.log('CLOCK-OUT ROUTE - Token:', token);
    
    // Call backend API
    const response = await fetch('http://localhost:5000/api/work/time-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body),
    });
    
    console.log('CLOCK-OUT ROUTE - Backend response status:', response.status);
    const data = await response.json();
    console.log('CLOCK-OUT ROUTE - Backend response data:', data);
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('CLOCK-OUT ROUTE - Error:', error);
    return NextResponse.json(
      { message: 'Clock out failed', error: error.message },
      { status: 500 }
    );
  }
}