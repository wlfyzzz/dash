import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail } from '@/functions/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Store the OTP in the database
    const { error } = await supabase
      .from('delete_otps')
      .insert({ email, otp, expires_at: expiresAt });

    if (error) throw error;

    // Send email with OTP
    const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Deletion OTP</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #1a1a1a; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #2a2a2a; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="padding: 40px 30px;">
            <h1 style="color: #ffffff; text-align: center; margin-bottom: 30px;">Account Deletion Request</h1>
            <p style="margin-bottom: 20px;">Hello,</p>
            <p>We received a request to delete your account. If you did not make this request, please ignore this email and ensure your account is secure.</p>
            <p>To confirm your account deletion, please use the following One-Time Password (OTP):</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 30px 0;">
                  <div style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 24px; letter-spacing: 5px;">${otp}</div>
                </td>
              </tr>
            </table>
            <p>This OTP will expire in 15 minutes for security reasons.</p>
            <p>If you have any questions or need assistance, please contact our support team immediately.</p>
            <p style="margin-top: 30px; border-top: 1px solid #4a4a4a; padding-top: 20px;">Best regards,<br>PicoChat</p>
          </td>
        </tr>
      </table>
      <p style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px;">This is an automated message, please do not reply to this email.</p>
    </body>
    </html>
    `;

    await sendEmail(email, "Account Deletion OTP", content);

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending delete OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

