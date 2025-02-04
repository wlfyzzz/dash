import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/functions/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const sessionId = crypto.randomBytes(12).toString('hex');

    // Store the reset session in Supabase
    const { error } = await supabase
      .from('resets')
      .insert({ session_id: sessionId, email, created_at: new Date().toISOString() });
    const { data: returnedData, error: fetchError} = await supabase.from("users").select("*").eq("email", email)
    if (returnedData?.length === 0) {
      return NextResponse.json({message: "User not found"}, {status: 404})
    }
    console.log(returnedData)
    console.log(email)
    if (error) throw error;

    // Send email with reset link
    const resetLink = `${process.env.NEXTAUTH_URL}reset-password/${sessionId}/${encodeURIComponent(email)}`;
    
    // TODO: Replace this with your actual email sending logic
    sendEmail(email, "Your reset password link!", `   <!DOCTYPE html>
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
            <h1 style="color: #ffffff; text-align: center; margin-bottom: 30px;">Reset Your Password</h1>
            <p style="margin-bottom: 20px;">Hello,</p>
            <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 30px 0;">
                  <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; transition: background-color 0.3s ease;">Reset Password</a>
                </td>
              </tr>
            </table>
            <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
            <p style="word-break: break-all;"><a href="${resetLink}" style="color: #60a5fa;">${resetLink}</a></p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p style="margin-top: 30px; border-top: 1px solid #4a4a4a; padding-top: 20px;">Best regards,<br>PicoChat</p>
          </td>
        </tr>
      </table>
      <p style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px;">This is an automated message, please do not reply to this email.</p>
    </body>
    </html>
    `)

    return NextResponse.json({ message: 'Reset password email sent' });
  } catch (error) {
    console.error('Reset password request error:', error);
    return NextResponse.json({ error: 'Failed to process reset password request' }, { status: 500 });
  }
}

