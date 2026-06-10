"use client";

import { FormEvent, useEffect, useState } from "react";
import { Globe, Lock } from "lucide-react";

import type { BookmarkRecord, BookmarkVisibility } from "@/lib/db/bookmarks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BookmarkFormState = {
  title: string;
  url: string;
  visibility: BookmarkVisibility;
};

const emptyState: BookmarkFormState = {
  title: "",
  url: "",
  visibility: "private",
};

export function BookmarkDialog({
  open,
  bookmark,
  submitting,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  bookmark: BookmarkRecord | null;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BookmarkFormState) => Promise<void>;
}) {
  const [values, setValues] = useState<BookmarkFormState>(emptyState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookmarkFormState, string>>
  >({});

  useEffect(() => {
    setValues(
      bookmark
        ? {
            title: bookmark.title,
            url: bookmark.url,
            visibility: bookmark.visibility,
          }
        : emptyState,
    );
    setErrors({});
  }, [bookmark, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof BookmarkFormState, string>> = {};

    if (!values.title.trim()) {
      nextErrors.title = "Title is required";
    }

    try {
      new URL(values.url);
    } catch {
      nextErrors.url = "Enter a valid URL";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>
            {bookmark ? "Edit bookmark" : "Add bookmark"}
          </DialogTitle>
          <DialogDescription>
            Save a link and choose whether it appears on your public profile.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="bookmark-title">Title</Label>
            <Input
              id="bookmark-title"
              value={values.title}
              aria-invalid={Boolean(errors.title)}
              className="transition-shadow focus:shadow-[0_0_0_3px_oklch(0.55_0.22_280/0.15)]"
              onChange={(event) =>
                setValues({ ...values, title: event.target.value })
              }
            />
            {errors.title ? (
              <p className="text-sm text-destructive">{errors.title}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookmark-url">URL</Label>
            <Input
              id="bookmark-url"
              value={values.url}
              aria-invalid={Boolean(errors.url)}
              placeholder="https://example.com"
              className="transition-shadow focus:shadow-[0_0_0_3px_oklch(0.55_0.22_280/0.15)]"
              onChange={(event) =>
                setValues({ ...values, url: event.target.value })
              }
            />
            {errors.url ? (
              <p className="text-sm text-destructive">{errors.url}</p>
            ) : null}
          </div>

          {/* visibility toggle */}
          <div className="space-y-2">
            <Label>Visibility</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValues({ ...values, visibility: "private" })}
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  values.visibility === "private"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                <Lock className="size-4 shrink-0" />
                Private
              </button>
              <button
                type="button"
                onClick={() => setValues({ ...values, visibility: "public" })}
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  values.visibility === "public"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                <Globe className="size-4 shrink-0" />
                Public
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving…
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
