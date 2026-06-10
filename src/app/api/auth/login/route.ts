import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { setSessionCookie, signSessionToken } from "@/lib/auth"
import { getUserByEmail, toSafeUser } from "@/lib/db/users"
import { loginSchema } from "@/lib/validations/auth"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json())
    const user = await getUserByEmail(input.email)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const passwordsMatch = await bcrypt.compare(input.password, user.password_hash)

    if (!passwordsMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!user.is_verified) {
      return NextResponse.json(
        { error: "Verify your email before logging in" },
        { status: 403 }
      )
    }

    const token = await signSessionToken({ sub: user.id, handle: user.handle })
    const response = NextResponse.json({ user: toSafeUser(user) })
    setSessionCookie(response, token)

    return response
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", issues: error.issues }, { status: 400 })
    }

    console.error("Login failed", error)
    return NextResponse.json({ error: "Could not log in" }, { status: 500 })
  }
}
