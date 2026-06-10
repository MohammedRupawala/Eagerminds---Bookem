import { getPublicBookmarksByHandle } from "@/lib/db/bookmarks";
import { BackButton } from "@/components/layout/PageActions";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export const runtime = "nodejs";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = await getPublicBookmarksByHandle(handle);

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="animate-fade-in mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col justify-center px-4 py-12">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Profile not found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                There is no public Bookem profile for @{handle}.
              </p>
              <BackButton />
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="animate-fade-in mx-auto min-h-[calc(100vh-3.5rem)] max-w-5xl px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="space-y-8">
          {/* profile header */}
          <div className="animate-fade-in-up relative overflow-hidden rounded-xl border bg-card p-8 shadow-sm">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[oklch(0.55_0.22_280/0.08)] blur-3xl"
            />
            <div className="relative flex flex-wrap items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted text-2xl font-bold">
                {profile.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {profile.user.name}
                </h1>
                <Badge variant="secondary" className="text-sm">
                  @{profile.user.handle}
                </Badge>
              </div>
            </div>
          </div>

          {/* bookmarks grid */}
          {profile.bookmarks.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profile.bookmarks.map((bookmark, i) => (
                <li
                  key={bookmark.id}
                  className={`animate-fade-in-up delay-${["75", "150", "225", "300", "375", "450"][i % 6]}`}
                >
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noreferrer"
                    className="card-hover group flex min-h-32 flex-col justify-between rounded-xl border bg-card p-5 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="flex-1 font-medium leading-snug">
                          {bookmark.title}
                        </span>
                        <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <span className="block truncate text-sm text-muted-foreground">
                        {bookmark.url}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="animate-fade-in-up rounded-xl border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                No public bookmarks yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
