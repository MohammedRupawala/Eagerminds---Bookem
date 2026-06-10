import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export function Navbar({ showDashboard = false }: { showDashboard?: boolean }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold">
          Bookem
        </Link>
        <nav className="flex items-center gap-2">
          {showDashboard ? (
            <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Dashboard
            </Link>
          ) : null}
          <Link href="/explore" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Explore
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Log in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  )
}
