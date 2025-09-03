import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('firebase-auth-token');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing auth token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}