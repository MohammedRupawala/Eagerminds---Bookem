import { getPublicBookmarksByHandle } from "@/lib/db/bookmarks"
import { BackButton } from "@/components/layout/PageActions"
import { Navbar } from "@/components/layout/Navbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const runtime = "nodejs"

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const profile = await getPublicBookmarksByHandle(handle)

  if (!profile) {
    return (
      <>
        <Navbar showDashboard />
        <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col justify-center px-4 py-12">
          <Card>
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
    )
  }

  return (
    <>
      <Navbar showDashboard />
      <main className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-5xl px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="space-y-8">
          <div className="rounded-lg border p-6 md:p-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {profile.user.name}
              </h1>
              <Badge variant="secondary">@{profile.user.handle}</Badge>
            </div>
          </div>
          <Separator />
          {profile.bookmarks.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {profile.bookmarks.map((bookmark) => (
                <li key={bookmark.id}>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block min-h-32 rounded-lg border p-5 hover:bg-muted"
                  >
                    <span className="font-medium">{bookmark.title}</span>
                    <span className="mt-2 block truncate text-sm text-muted-foreground">
                      {bookmark.url}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border p-10 text-center">
              <p className="text-sm text-muted-foreground">No public bookmarks yet.</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
