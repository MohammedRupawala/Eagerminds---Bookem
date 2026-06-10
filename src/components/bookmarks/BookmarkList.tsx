"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { BookmarkCard } from "@/components/bookmarks/BookmarkCard";
import { BookmarkDialog } from "@/components/bookmarks/BookmarkDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BookmarkRecord, BookmarkVisibility } from "@/lib/db/bookmarks";

type BookmarkFormState = {
  title: string;
  url: string;
  visibility: BookmarkVisibility;
};

export function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<BookmarkRecord | null>(
    null,
  );
  const [deletingBookmark, setDeletingBookmark] =
    useState<BookmarkRecord | null>(null);

  useEffect(() => {
    async function loadBookmarks() {
      try {
        const response = await fetch("/api/bookmarks");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Could not load bookmarks");
        }

        setBookmarks(data.bookmarks);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not load bookmarks",
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookmarks();
  }, []);

  function openCreateDialog() {
    setEditingBookmark(null);
    setDialogOpen(true);
  }

  function openEditDialog(bookmark: BookmarkRecord) {
    setEditingBookmark(bookmark);
    setDialogOpen(true);
  }

  async function saveBookmark(values: BookmarkFormState) {
    setSubmitting(true);

    try {
      const response = await fetch(
        editingBookmark
          ? `/api/bookmarks/${editingBookmark.id}`
          : "/api/bookmarks",
        {
          method: editingBookmark ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not save bookmark");
      }

      setBookmarks((current) =>
        editingBookmark
          ? current.map((bookmark) =>
              bookmark.id === data.bookmark.id ? data.bookmark : bookmark,
            )
          : [data.bookmark, ...current],
      );
      setDialogOpen(false);
      toast.success(editingBookmark ? "Bookmark edited" : "Bookmark added");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save bookmark",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deletingBookmark) {
      return;
    }

    try {
      const response = await fetch(`/api/bookmarks/${deletingBookmark.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete bookmark");
      }

      setBookmarks((current) =>
        current.filter((bookmark) => bookmark.id !== deletingBookmark.id),
      );
      setDeletingBookmark(null);
      toast.success("Bookmark deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete bookmark",
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* dashboard header */}
      <div className="animate-fade-in-up relative overflow-hidden rounded-xl border bg-card p-8 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[oklch(0.55_0.22_280/0.08)] blur-3xl"
        />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Dashboard
            </h1>
            <p className="text-base text-muted-foreground">
              Manage private bookmarks and choose which links appear on your
              public shelf.
            </p>
          </div>
          <Button className="w-full gap-2 md:w-auto" onClick={openCreateDialog}>
            <span className="text-lg leading-none">+</span>
            Add bookmark
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark, i) => (
            <div
              key={bookmark.id}
              className={`animate-fade-in-up delay-${["75", "150", "225", "300", "375", "450"][i % 6]}`}
            >
              <BookmarkCard
                bookmark={bookmark}
                onEdit={openEditDialog}
                onDelete={setDeletingBookmark}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in-up rounded-xl border p-14 text-center shadow-sm">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-2xl">
            🔖
          </div>
          <h2 className="text-lg font-semibold">No bookmarks yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first link to start building your shelf.
          </p>
          <Button className="mt-5 gap-2" onClick={openCreateDialog}>
            <span className="text-lg leading-none">+</span>
            Add bookmark
          </Button>
        </div>
      )}

      <BookmarkDialog
        open={dialogOpen}
        bookmark={editingBookmark}
        submitting={submitting}
        onOpenChange={setDialogOpen}
        onSubmit={saveBookmark}
      />

      <AlertDialog
        open={Boolean(deletingBookmark)}
        onOpenChange={(open) => !open && setDeletingBookmark(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete bookmark?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the bookmark from your shelf permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
