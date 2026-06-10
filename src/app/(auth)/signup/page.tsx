"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"

import { BackButton } from "@/components/layout/PageActions"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type SignupValues = {
  name: string
  email: string
  password: string
  handle: string
}

export default function SignupPage() {
  const [values, setValues] = useState<SignupValues>({
    name: "",
    email: "",
    password: "",
    handle: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SignupValues | "form", string>>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function updateValue(field: keyof SignupValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function validate() {
    const nextErrors: Partial<Record<keyof SignupValues, string>> = {}

    if (!values.name.trim()) {
      nextErrors.name = "Name is required"
    }

    if (!values.email.includes("@")) {
      nextErrors.email = "Enter a valid email"
    }

    if (values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters"
    }

    if (!/^[a-z0-9_]{3,50}$/.test(values.handle)) {
      nextErrors.handle = "Use 3-50 lowercase letters, numbers, or underscores"
    }

    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Could not create account")
      }

      setSuccessMessage(data.message ?? "Check your email to verify your account.")
      setValues({ name: "", email: "", password: "", handle: "" })
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Could not create account",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <BackButton />
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">Create your shelf</h1>
            <p className="max-w-xl text-muted-foreground">
              Sign up, verify your email, then start saving private and public bookmarks.
            </p>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
            {errors.form ? <p className="text-sm text-destructive">{errors.form}</p> : null}
            {successMessage ? (
              <p className="rounded-md border p-3 text-sm text-muted-foreground">
                {successMessage}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => updateValue("name", event.target.value)}
              />
              {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                onChange={(event) => updateValue("email", event.target.value)}
              />
              {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                aria-invalid={Boolean(errors.password)}
                onChange={(event) => updateValue("password", event.target.value)}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">{errors.password}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Handle</Label>
              <Input
                id="handle"
                value={values.handle}
                aria-invalid={Boolean(errors.handle)}
                onChange={(event) => updateValue("handle", event.target.value.toLowerCase())}
              />
              {errors.handle ? <p className="text-sm text-destructive">{errors.handle}</p> : null}
            </div>
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Creating account" : "Create account"}
            </Button>
            </form>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
