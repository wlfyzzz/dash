import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId, title } = await req.json()
  if (title === null) {
    const { data, error } = await supabase.from('access').delete().eq('user_id',userId).eq('title', null)
  }

  try {
    const { data, error } = await supabase
      .from('access')
      .delete()
      .eq('user_id', userId)
      .eq('title', title)

    if (error) throw error

    return NextResponse.json({ error:null,message: "Deleted."  })
  } catch (error) {
    return NextResponse.json({ error: 'User not found.' }, { status: 500 })
  }
}
