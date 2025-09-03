import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    
    // Cookie setzen (Name konsistent mit middleware.ts und page.tsx)
    cookieStore.set('firebase-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5 // 5 Tage
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting auth token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}