import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react';

export async function POST(req: Request) {

  const { userId } = await req.json()

  try {
    const { data, error } = await supabase
      .from('users')
      .select("*")
      .eq('userId', userId)

    if (error) throw error
    delete data[0].password 

    return NextResponse.json({user: data[0] })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

