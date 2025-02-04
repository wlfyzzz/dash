import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react';

export async function POST(req: Request) {

  const { id, name, email, userSession } = await req.json()
  const { data } = await supabase.from('users').select("session").eq('userId', id)
  const sessionDB = data?.[0]?.session ?? null;
  if (sessionDB !== userSession) {
    return NextResponse.json({error: "Invalid session."}, {status: 500})
  }
  try {
    const { error } = await supabase
      .from('users')
      .update({ name, email })
      .eq('userId', id)

    if (error) throw error

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

