import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react';
import next from 'next';

export async function POST(req: Request) {

  const { userId } = await req.json()

  try {
    // return NextResponse.json({user: false}) // for testing route only
    const { data, error } = await supabase
      .from('users')
      .select("banned")
      .eq('userId', userId)

    if (error) throw error 

    return NextResponse.json({user: data[0].banned })

} catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

