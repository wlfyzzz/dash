import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { sessionId, email, password } = await req.json();
    const decodedEmail = decodeURIComponent(email);
    const { data: resetData, error: resetError } = await supabase
      .from('resets')
      .select()
      .eq('session_id', sessionId)
      .eq('email', decodedEmail)
      .single();

    if (resetError || !resetData) {
      return NextResponse.json({ error: 'Invalid or expired reset session' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', decodedEmail);

    if (updateError) {
      throw updateError;
    }
    await supabase
      .from('resets')
      .delete()
      .eq('session_id', sessionId);

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}

