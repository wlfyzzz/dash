import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react';

export async function POST(req: Request) {

  const { userId } = await req.json()

  try {
    const { data, error } = await supabase
      .from('users')
      .select("badges")
      .eq('userId', userId)

    if (error) throw error

    return NextResponse.json({badges: data[0].badges })
  } catch (error) {
    return NextResponse.json({ error: 'User not found.' }, { status: 500 })
  }
}

