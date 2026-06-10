import Link from "next/link";
import { BookOpen, Lock, Search } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: Lock,
    title: "Private & public",
    description: "Keep links private or flip them public with one click.",
  },
  {
    icon: BookOpen,
    title: "Your shelf",
    description: "A clean, shareable profile page for your public bookmarks.",
  },
  {
    icon: Search,
    title: "Explore",
    description: "Discover and browse public shelves from verified users.",
  },
];

export default function HomePage() {
  return (
    <main className="animate-fade-in">
      <Navbar />

      {/* Hero */}
      <section className="relative mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl items-center gap-12 overflow-hidden px-4 py-16 lg:grid-cols-2">
        {/* decorative blur blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[oklch(0.55_0.22_280/0.12)] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[oklch(0.65_0.2_320/0.08)] blur-3xl"
        />

        {/* left: copy */}
        <div className="relative space-y-6">
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[oklch(0.55_0.22_280)]" />
            Bookmark manager for curious minds
          </div>
          <h1 className="animate-fade-in-up delay-75 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Your links, <span className="text-brand-gradient">your shelf.</span>
          </h1>
          <p className="animate-fade-in-up delay-150 max-w-lg text-lg text-muted-foreground">
            Save bookmarks privately, publish the links worth sharing, and
            discover public shelves from other users.
          </p>
          <div className="animate-fade-in-up delay-225 flex flex-wrap gap-3">
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Get started free
            </Link>
            <Link
              href="/explore"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Browse shelves
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              Log in
            </Link>
          </div>
        </div>

        {/* right: feature cards */}
        <div className="relative grid gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`card-hover animate-fade-in-up rounded-xl border bg-card p-5 shadow-sm delay-${[150, 225, 300][i]}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <Separator className="my-2" />

          <p className="animate-fade-in-up delay-375 text-xs text-muted-foreground">
            Email verification required &middot; No credit card needed
          </p>
        </div>
      </section>
    </main>
  );
}
