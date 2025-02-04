import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { supabase } from '@/lib/supabase'
import { useSession } from 'next-auth/react';

export async function POST(req: Request) {

  try {
    const formData = await req.formData()
    console.log(formData)
    const file = formData.get('avatar') as File
    const user = formData.get('user') as String


    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user}-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const avatarUrl = publicUrlData.publicUrl

    const { error: updateError } = await supabase
      .from('users')
      .update({ image: avatarUrl })
      .eq('userId', user)

    if (updateError) throw updateError

    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Error updating avatar:', error)
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 })
  }
}

