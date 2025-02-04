'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.resendKey)

export async function sendEmail(email: string, subject: string, content: string) {
  try {
    await resend.emails.send({
      from: 'mail@demo.thatdevwolfy.lol',
      to: email,
      subject: subject,
      html: content
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to send email' }
  }
}
