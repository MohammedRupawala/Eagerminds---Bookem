"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { BackButton } from "@/components/layout/PageActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type SignupValues = {
  name: string;
  email: string;
  password: string;
  handle: string;
};

export default function SignupPage() {
  const [values, setValues] = useState<SignupValues>({
    name: "",
    email: "",
    password: "",
    handle: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupValues | "form", string>>
  >({});
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateValue(field: keyof SignupValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors: Partial<Record<keyof SignupValues, string>> = {};

    if (!values.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!values.email.includes("@")) {
      nextErrors.email = "Enter a valid email";
    }

    if (values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    if (!/^[a-z0-9_]{3,50}$/.test(values.handle)) {
      nextErrors.handle = "Use 3-50 lowercase letters, numbers, or underscores";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not create account");
      }

      setSuccessMessage(
        data.message ?? "Check your email to verify your account.",
      );
      setValues({ name: "", email: "", password: "", handle: "" });
    } catch (error) {
      setErrors({
        form:
          error instanceof Error ? error.message : "Could not create account",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="animate-fade-in mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl items-center gap-12 px-4 py-10 lg:grid-cols-[1fr_1fr]">
      {/* Left side */}
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <BackButton />
        </div>
        <div className="animate-fade-in-up delay-75 space-y-3">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Create your shelf
          </h1>
          <p className="max-w-sm text-muted-foreground">
            Sign up, verify your email, then start saving private and public
            bookmarks.
          </p>
        </div>
        <ul className="animate-fade-in-up delay-150 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[oklch(0.55_0.22_280)]" />
            Private and public bookmark visibility
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[oklch(0.55_0.22_280)]" />
            Choose your unique handle
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[oklch(0.55_0.22_280)]" />
            Shareable public profile page
          </li>
        </ul>
      </div>

      {/* Right: form card */}
      <Card className="animate-fade-in-up delay-150 w-full shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errors.form ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {errors.form}
              </p>
            ) : null}
            {successMessage ? (
              <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                {successMessage}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                className="transition-shadow focus:shadow-[0_0_0_3px_oklch(0.55_0.22_280/0.15)]"
                onChange={(event) => updateValue("name", event.target.value)}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                className="transition-shadow focus:shadow-[0_0_0_3px_oklch(0.55_0.22_280/0.15)]"
                onChange={(event) => updateValue("email", event.target.value)}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                aria-invalid={Boolean(errors.password)}
                className="transition-shadow focus:shadow-[0_0_0_3px_oklch(0.55_0.22_280/0.15)]"
                onChange={(event) =>
                  updateValue("password", event.target.value)
                }
              />
              {errors.password ? (
                <p className="text-sm text-destructive">{errors.password}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Handle</Label>
              <div className="flex items-center">
                <span className="flex h-9 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  id="handle"
                  value={values.handle}
                  aria-invalid={Boolean(errors.handle)}
                  className="rounded-l-none transition-shadow focus:shadow-[0_0_0_3px_oklch(0.55_0.22_280/0.15)]"
                  onChange={(event) =>
                    updateValue("handle", event.target.value.toLowerCase())
                  }
                />
              </div>
              {errors.handle ? (
                <p className="text-sm text-destructive">{errors.handle}</p>
              ) : null}
            </div>
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          <Separator className="my-5" />
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
