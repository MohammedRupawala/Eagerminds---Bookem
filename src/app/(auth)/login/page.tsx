"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"

import { BackButton } from "@/components/layout/PageActions"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const router = useRouter()
  const [verified, setVerified] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [resendMessage, setResendMessage] = useState("")
  const [canResendVerification, setCanResendVerification] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    setVerified(new URLSearchParams(window.location.search).get("verified"))
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: typeof errors = {}

    if (!email.includes("@")) {
      nextErrors.email = "Enter a valid email"
    }

    if (!password) {
      nextErrors.password = "Password is required"
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)
    setCanResendVerification(false)
    setResendMessage("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Could not log in")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not log in"
      if (message.toLowerCase().includes("verify your email")) {
        setCanResendVerification(true)
      }
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function resendVerification() {
    if (!email.includes("@")) {
      setErrors({ email: "Enter the email you used to sign up" })
      return
    }

    setResending(true)
    setResendMessage("")

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Could not resend verification email")
      }

      setResendMessage(data.message ?? "Verification email sent. Check your inbox.")
    } catch (error) {
      setResendMessage(
        error instanceof Error ? error.message : "Could not resend verification email"
      )
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <BackButton />
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">Welcome back</h1>
            <p className="max-w-xl text-muted-foreground">
              Log in after verifying your email to manage private links and publish selected bookmarks.
            </p>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Log in</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
            {verified === "success" ? (
              <p className="rounded-md border p-3 text-sm text-muted-foreground">
                Email verified. You can log in now.
              </p>
            ) : null}
            {verified === "invalid" ? (
              <p className="text-sm text-destructive">
                Verification link is invalid or expired.
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                aria-invalid={Boolean(errors.email)}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                aria-invalid={Boolean(errors.password)}
                onChange={(event) => setPassword(event.target.value)}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">{errors.password}</p>
              ) : null}
            </div>
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Logging in" : "Log in"}
            </Button>
            </form>
            {canResendVerification ? (
              <div className="mt-4 rounded-md border p-3">
                <p className="text-sm text-muted-foreground">
                  Did not receive the verification email?
                </p>
                <Button
                  className="mt-3"
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resendVerification}
                  disabled={resending}
                >
                  {resending ? "Sending" : "Resend verification email"}
                </Button>
                {resendMessage ? (
                  <p className="mt-2 text-sm text-muted-foreground">{resendMessage}</p>
                ) : null}
              </div>
            ) : null}
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">
              Need an account?{" "}
              <Link href="/signup" className="text-foreground underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
