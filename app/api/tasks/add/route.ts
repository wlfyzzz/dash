import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId, title } = await req.json()

  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({title: title, user_id: userId})

    if (error) throw error

    return NextResponse.json({ error: null, message:"Added succesfully" })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
