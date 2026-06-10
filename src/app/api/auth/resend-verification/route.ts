import { NextResponse } from "next/server"
import { ZodError, z } from "zod"

import { signEmailVerificationToken } from "@/lib/auth"
import { getUserByEmail } from "@/lib/db/users"
import { sendWelcomeEmail } from "@/lib/email"

const resendVerificationSchema = z.object({
  email: z.email("Enter a valid email").transform((email) => email.toLowerCase()),
})

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const input = resendVerificationSchema.parse(await request.json())
    const user = await getUserByEmail(input.email)

    if (!user || user.is_verified) {
      return NextResponse.json({
        message: "If this account needs verification, a new email has been sent.",
      })
    }

    const verificationToken = await signEmailVerificationToken({
      sub: user.id,
      email: user.email,
    })
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    const emailResult = await sendWelcomeEmail({
      to: user.email,
      name: user.name,
      handle: user.handle,
      verificationUrl: `${appUrl}/api/auth/verify?token=${encodeURIComponent(verificationToken)}`,
    })

    if (!emailResult.sent) {
      return NextResponse.json(
        {
          error:
            "Could not send verification email. Check RESEND_FROM_EMAIL and your verified Resend domain.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      message: "Verification email sent. Check your inbox.",
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", issues: error.issues }, { status: 400 })
    }

    console.error("Resend verification failed", error)
    return NextResponse.json({ error: "Could not resend verification email" }, { status: 500 })
  }
}
