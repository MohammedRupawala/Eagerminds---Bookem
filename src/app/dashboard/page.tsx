import { BookmarkList } from "@/components/bookmarks/BookmarkList";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-3.5rem)] w-full max-w-7xl px-4 py-8">
        <BookmarkList />
      </main>
    </>
  );
}
