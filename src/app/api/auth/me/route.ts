import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('ME ROUTE - GET method called');
  
  try {
    const token = request.headers.get('Authorization');
    console.log('ME ROUTE - Token:', token);
    
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }
    
    // Call backend API
    const response = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });
    
    console.log('ME ROUTE - Backend response status:', response.status);
    const data = await response.json();
    console.log('ME ROUTE - Backend response data:', data);
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('ME ROUTE - Error:', error);
    return NextResponse.json(
      { message: 'Failed to get user details', error: error },
      { status: 500 }
    );
  }
}