import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { id, otp } = await req.json();

    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('delete_otps')
      .select('*')
      .eq('otp', otp)
      .single();

    if (otpError || !otpData) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    if (new Date() > new Date(otpData.expires_at)) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Delete user account
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('userId', id);

    if (deleteError) {
      throw deleteError;
    }

    // Delete OTP entry
    await supabase
      .from('delete_otps')
      .delete()
      .eq('otp', otp);

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}

