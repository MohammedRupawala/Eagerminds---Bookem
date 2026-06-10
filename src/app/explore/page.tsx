"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"

import { BackButton } from "@/components/layout/PageActions"
import { Navbar } from "@/components/layout/Navbar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

type SearchUser = {
  id: string
  name: string
  handle: string
  is_verified: boolean
}

export default function ExplorePage() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<SearchUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSearched(true)

    if (query.trim().length < 2) {
      setUsers([])
      setError("Search with at least 2 characters")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/profile/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Could not search users")
      }

      setUsers(data.users)
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Could not search users")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar showDashboard />
      <main className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-6xl px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="space-y-8">
          <div className="rounded-lg border p-6 md:p-8">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Explore Bookem
              </h1>
              <p className="text-base text-muted-foreground">
                Search verified users and open their public bookmark shelves.
              </p>
            </div>
          </div>

        <Card>
          <CardContent className="pt-6">
            <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSearch}>
              <div className="flex-1 space-y-2">
                <Label htmlFor="profile-search">Search users</Label>
                <Input
                  id="profile-search"
                  value={query}
                  placeholder="name or handle"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Searching" : "Search"}
              </Button>
            </form>
            {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
          </CardContent>
        </Card>

        <Separator />

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-36" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">@{user.handle}</p>
                    </div>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/${user.handle}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    View public bookmarks
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searched && !error ? (
          <p className="text-sm text-muted-foreground">No matching verified users found.</p>
        ) : null}
        </div>
      </main>
    </>
  )
}
