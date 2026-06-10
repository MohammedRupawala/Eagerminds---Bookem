import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { signEmailVerificationToken } from "@/lib/auth"
import { createUser } from "@/lib/db/users"
import { sendWelcomeEmail } from "@/lib/email"
import { signupSchema } from "@/lib/validations/auth"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const input = signupSchema.parse(await request.json())
    const passwordHash = await bcrypt.hash(input.password, 12)
    const user = await createUser({
      name: input.name,
      email: input.email,
      passwordHash,
      handle: input.handle,
    })
    const verificationToken = await signEmailVerificationToken({
      sub: user.id,
      email: user.email,
    })
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    const emailResult = await sendWelcomeEmail({
      // to: user.email,
      to: "mohammedrupawala8@gmail.com",
      name: user.name,
      handle: user.handle,
      verificationUrl: `${appUrl}/api/auth/verify?token=${encodeURIComponent(verificationToken)}`,
    })

    const response = NextResponse.json(
      {
        message: emailResult.sent
          ? "Account created. Check your email to verify your account before logging in."
          : "Account created, but the verification email could not be sent. Check Resend sender/domain settings and try resending from the login page.",
        emailSent: emailResult.sent,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          handle: user.handle,
          is_verified: user.is_verified,
        },
      },
      { status: 201 }
    )


    return response
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", issues: error.issues }, { status: 400 })
    }

    if (typeof error === "object" && error && "code" in error && error.code === "23505") {
      return NextResponse.json({ error: "Email or handle is already in use" }, { status: 409 })
    }

    console.error("Signup failed", error)
    return NextResponse.json({ error: "Could not create account" }, { status: 500 })
  }
}
