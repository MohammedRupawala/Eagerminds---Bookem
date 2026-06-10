import Link from "next/link";

import { getSession } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/layout/PageActions";

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-1.5 text-sm font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="inline-block size-5 rounded-md bg-foreground transition-transform duration-200 group-hover:rotate-6" />
          <span>Bookem</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/explore"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Explore
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log in
              </Link>
              <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
