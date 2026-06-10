import { BookmarkList } from "@/components/bookmarks/BookmarkList"
import { BackButton, LogoutButton } from "@/components/layout/PageActions"
import { Navbar } from "@/components/layout/Navbar"

export default function DashboardPage() {
  return (
    <>
      <Navbar showDashboard />
      <main className="mx-auto min-h-[calc(100vh-3.5rem)] w-full max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <BackButton />
          <LogoutButton />
        </div>
        <BookmarkList />
      </main>
    </>
  )
}
