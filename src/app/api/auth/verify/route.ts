import { NextResponse } from "next/server"

import { verifyEmailVerificationToken } from "@/lib/auth"
import { verifyUserEmail } from "@/lib/db/users"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token") ?? undefined
  const payload = await verifyEmailVerificationToken(token)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? url.origin

  if (!payload) {
    return NextResponse.redirect(`${appUrl}/login?verified=invalid`)
  }

  const user = await verifyUserEmail(payload.sub, payload.email)

  if (!user) {
    return NextResponse.redirect(`${appUrl}/login?verified=invalid`)
  }

  return NextResponse.redirect(`${appUrl}/login?verified=success`)
}
