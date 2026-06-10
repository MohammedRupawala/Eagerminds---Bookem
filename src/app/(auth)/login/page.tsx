"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { BackButton } from "@/components/layout/PageActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const [verified, setVerified] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [resendMessage, setResendMessage] = useState("");
  const [canResendVerification, setCanResendVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    setVerified(new URLSearchParams(window.location.search).get("verified"));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};

    if (!email.includes("@")) {
      nextErrors.email = "Enter a valid email";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setCanResendVerification(false);
    setResendMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not log in");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not log in";
      if (message.toLowerCase().includes("verify your email")) {
        setCanResendVerification(true);
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function resendVerification() {
    if (!email.includes("@")) {
      setErrors({ email: "Enter the email you used to sign up" });
      return;
    }

    setResending(true);
    setResendMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not resend verification email");
      }

      setResendMessage(
        data.message ?? "Verification email sent. Check your inbox.",
      );
    } catch (error) {
      setResendMessage(
        error instanceof Error
          ? error.message
          : "Could not resend verification email",
      );
    } finally {
      setResending(false);
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
            Welcome back
          </h1>
          <p className="max-w-sm text-muted-foreground">
            Log in to manage private links and publish selected bookmarks to
            your public shelf.
          </p>
        </div>
        <ul className="animate-fade-in-up delay-150 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[oklch(0.55_0.22_280)]" />
            Private and public bookmark visibility
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[oklch(0.55_0.22_280)]" />
            Email verification required
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[oklch(0.55_0.22_280)]" />
            Shareable public profile
          </li>
        </ul>
      </div>

      {/* Right: form card */}
      <Card className="animate-fade-in-up delay-150 w-full shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {verified === "success" ? (
              <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                Email verified — you can log in now.
              </p>
            ) : null}
            {verified === "invalid" ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
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
                className="transition-shadow focus:shadow-[0_0_0_3px_oklch(0.55_0.22_280/0.15)]"
                onChange={(event) => setEmail(event.target.value)}
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
                value={password}
                aria-invalid={Boolean(errors.password)}
                className="transition-shadow focus:shadow-[0_0_0_3px_oklch(0.55_0.22_280/0.15)]"
                onChange={(event) => setPassword(event.target.value)}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">{errors.password}</p>
              ) : null}
            </div>
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Logging in…
                </span>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
          {canResendVerification ? (
            <div className="mt-4 rounded-lg border bg-muted/50 p-4">
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
                {resending ? "Sending…" : "Resend verification email"}
              </Button>
              {resendMessage ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {resendMessage}
                </p>
              ) : null}
            </div>
          ) : null}
          <Separator className="my-5" />
          <p className="text-sm text-muted-foreground">
            Need an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
