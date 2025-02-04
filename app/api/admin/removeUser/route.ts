import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react';
import next from 'next';

export async function POST(req: Request) {

  const { userId, sessionKey } = await req.json()
    if (!sessionKey || sessionKey !== process.env.NEXT_PUBLIC_apikey) {
        return NextResponse.json({error: "Route not found"}, { status: 404 })
    }
  try {
    var banned = true
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error 
    return NextResponse.json({"success": true})
} catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

