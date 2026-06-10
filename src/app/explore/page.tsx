"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { FormEvent, useState } from "react";

import { BackButton } from "@/components/layout/PageActions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type SearchUser = {
  id: string;
  name: string;
  handle: string;
  is_verified: boolean;
};

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSearched(true);

    if (query.trim().length < 2) {
      setUsers([]);
      setError("Search with at least 2 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/profile/search?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not search users");
      }

      setUsers(data.users);
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Could not search users",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="animate-fade-in mx-auto min-h-[calc(100vh-3.5rem)] max-w-6xl px-4 py-8">
      <div className="mb-6">
        <BackButton />
      </div>
      <div className="space-y-8">
        {/* hero banner */}
        <div className="animate-fade-in-up relative overflow-hidden rounded-xl border bg-card p-8 shadow-sm">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[oklch(0.55_0.22_280/0.08)] blur-3xl"
          />
          <div className="relative max-w-3xl space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Explore Bookem
            </h1>
            <p className="text-base text-muted-foreground">
              Search verified users and open their public bookmark shelves.
            </p>
          </div>
        </div>

        {/* search card */}
        <Card className="animate-fade-in-up delay-75 shadow-sm">
          <CardContent className="pt-6">
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={handleSearch}
            >
              <div className="flex-1 space-y-2">
                <Label htmlFor="profile-search">Search users</Label>
                <Input
                  id="profile-search"
                  value={query}
                  placeholder="name or handle…"
                  className="transition-shadow focus:shadow-[0_0_0_3px_oklch(0.55_0.22_280/0.15)]"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading} className="gap-2">
                <Search className="size-4" />
                {loading ? "Searching…" : "Search"}
              </Button>
            </form>
            {error ? (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            ) : null}
          </CardContent>
        </Card>

        {/* results */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {users.map((user, i) => (
              <Card
                key={user.id}
                className={`card-hover animate-fade-in-up delay-${["75", "150", "225", "300", "375", "450"][i] ?? "450"} shadow-sm`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        @{user.handle}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/${user.handle}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    View public bookmarks
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searched && !error ? (
          <div className="animate-fade-in-up rounded-xl border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No matching verified users found.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
