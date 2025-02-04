import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react';

export async function POST(req: Request) {

  try {
    const { data, error } = await supabase
      .from('users')
      .select("*")

    if (error) throw error

    return NextResponse.json({users: data.length })
  } catch (error) {
    return NextResponse.json({ error: 'User not found.' }, { status: 500 })
  }
}

