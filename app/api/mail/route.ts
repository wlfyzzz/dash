import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/functions/email'

export async function POST(req: Request) {
  try {
    const { email, text } = await req.json()
    sendEmail(email, "Reset-Password Link", `${text}`)
    return NextResponse.json({ error: 'Sent verification code.' }, { status: 200 })
} catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

