import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {

  const {id, currentPassword, newPassword } = await req.json();
  console.log("Received payload:", { id, currentPassword, newPassword });
  try {
    // Fetch the user's current password hash
    const currentPass = currentPassword
    const { data: returnedData, error: fetchError } = await supabase
      .from('users')
      .select('password')
      .eq('userId', id).single();
      const DataPassword = returnedData?.password
      console.log(DataPassword)
    

      console.log(typeof DataPassword)
      console.log(typeof currentPass)
  

    if (fetchError) throw fetchError;

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(String(currentPass), String(DataPassword));
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }
    console.log(id)

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('userId', id);

    if (updateError) throw updateError;

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
