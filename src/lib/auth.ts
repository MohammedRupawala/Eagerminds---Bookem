import { SignJWT } from "jose/jwt/sign"
import { jwtVerify } from "jose/jwt/verify"
import { NextResponse, type NextRequest } from "next/server"

export const SESSION_COOKIE_NAME = "session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7
const EMAIL_VERIFICATION_TTL_SECONDS = 60 * 60 * 24

export type SessionPayload = {
  sub: string
  handle: string
}

export type EmailVerificationPayload = {
  sub: string
  email: string
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters")
  }

  return new TextEncoder().encode(secret)
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ handle: payload.handle })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getJwtSecret())
}

export async function signEmailVerificationToken(payload: EmailVerificationPayload) {
  return new SignJWT({
    email: payload.email,
    purpose: "email_verification",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${EMAIL_VERIFICATION_TTL_SECONDS}s`)
    .sign(getJwtSecret())
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret())

    if (!payload.sub || typeof payload.handle !== "string") {
      return null
    }

    return {
      sub: payload.sub,
      handle: payload.handle,
    }
  } catch {
    return null
  }
}

export async function verifyEmailVerificationToken(token: string | undefined) {
  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret())

    if (
      !payload.sub ||
      payload.purpose !== "email_verification" ||
      typeof payload.email !== "string"
    ) {
      return null
    }

    return {
      sub: payload.sub,
      email: payload.email,
    }
  } catch {
    return null
  }
}

export async function getSession() {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  return verifySessionToken(token)
}

export async function getSessionFromRequest(request: NextRequest) {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
}
