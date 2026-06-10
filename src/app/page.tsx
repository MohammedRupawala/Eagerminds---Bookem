import Link from "next/link"

import { Navbar } from "@/components/layout/Navbar"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Bookem</h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Save bookmarks privately, publish the links worth sharing, and discover public shelves from other users.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Create account
            </Link>
            <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Log in
            </Link>
            <Link href="/explore" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              Explore profiles
            </Link>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">What you can do</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">Keep a private archive and curate a clean public profile.</p>
            <Separator />
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Private and public bookmark visibility.</li>
              <li>Email verification before login.</li>
              <li>Searchable public user shelves.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
