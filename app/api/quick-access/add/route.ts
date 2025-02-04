import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId, title, url } = await req.json()
  if (title === null || url === null) {
    return NextResponse.json({error: "Duplicate requeest",message: "Request sent twice."})
  }
  console.log(userId, title, url)
  try {
    const { data, error } = await supabase
      .from('access')
      .insert({title: title, url: url, user_id: userId})

    if (error) throw error

    return NextResponse.json({ error: null, message:"Added succesfully" })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
