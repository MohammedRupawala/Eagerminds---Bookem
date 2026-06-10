// Server-only: uses next/headers (not safe for Edge/middleware)
import { cookies } from "next/headers"

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return verifySessionToken(token)
}
