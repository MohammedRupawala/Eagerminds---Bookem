import { Resend } from "resend"

export async function sendWelcomeEmail(input: {
  to: string
  name: string
  handle: string
  verificationUrl: string
}) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      return {
        sent: false,
        error: "RESEND_API_KEY is not configured",
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    const resend = new Resend(apiKey)
    const profileUrl = `${appUrl}/${input.handle}`
    const from = process.env.RESEND_FROM_EMAIL ?? "Bookem <onboarding@resend.dev>"

    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: `Verify your Bookem email, ${input.name}`,
      html: `
        <p>Hi ${input.name},</p>
        <p>Welcome to Bookem. Verify your email before logging in.</p>
        <p>Your public handle will be <strong>/${input.handle}</strong>.</p>
        <p>Your public profile is available at <a href="${profileUrl}">${profileUrl}</a>.</p>
        <p><a href="${input.verificationUrl}">Verify your email</a></p>
      `,
    })

    if (error) {
      console.error("Resend rejected verification email", error)
      return {
        sent: false,
        error: error.message,
      }
    }

    return {
      sent: true,
    }
  } catch (error) {
    console.error("Failed to send welcome email", error)
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Could not send verification email",
    }
  }
}
