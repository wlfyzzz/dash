import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { sessionId, email } = await req.json();
    const decodedEmail = decodeURIComponent(email);

    // Check if the reset session exists and is valid
    const { data, error } = await supabase
      .from('resets')
      .select()
      .eq('session_id', sessionId)
      .eq('email', decodedEmail)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid or expired reset session' }, { status: 400 });
    }

    // TODO: You might want to add an expiration check here

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Verify reset session error:', error);
    return NextResponse.json({ error: 'Failed to verify reset session' }, { status: 500 });
  }
}

