import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/functions/email'

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()
    sendEmail(email, "Your verification code.", `   <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #1a1a1a; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #2a2a2a; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="padding: 40px 30px;">
            <h1 style="color: #ffffff; text-align: center; margin-bottom: 30px;">Sign up</h1>
            <p style="margin-bottom: 20px;">Hello,</p>
            <p>We received a request to sign up. If you didn't make this request, you can safely ignore this email.</p>
            <p>To finish signing up, Enter the code provided bellow on the page.:</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 30px 0;">
                  <a style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; transition: background-color 0.3s ease;">${code}</a>
                </td>
              </tr>
            </table>
            <p style="margin-top: 30px; border-top: 1px solid #4a4a4a; padding-top: 20px;">Best regards,<br>PicoChat</p>
          </td>
        </tr>
      </table>
      <p style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px;">This is an automated message, please do not reply to this email.</p>
    </body>
    </html>
    `)
    return NextResponse.json({ error: 'Sent verification code.' }, { status: 200 })
} catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

