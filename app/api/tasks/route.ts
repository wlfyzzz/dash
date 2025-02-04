import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId } = await req.json()

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select("*")
      .eq('user_id', userId)

    if (error) throw error

    // Ensure data is always returned as an array, even if it's empty
    const tasksArray = Array.isArray(data) ? data : []

    return NextResponse.json({ tasks: tasksArray })
  } catch (error) {
    return NextResponse.json({ error: 'User not found.' }, { status: 500 })
  }
}
