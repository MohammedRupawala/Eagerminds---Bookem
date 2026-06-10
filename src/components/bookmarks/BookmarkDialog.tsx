"use client"

import { FormEvent, useEffect, useState } from "react"

import type { BookmarkRecord, BookmarkVisibility } from "@/lib/db/bookmarks"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type BookmarkFormState = {
  title: string
  url: string
  visibility: BookmarkVisibility
}

const emptyState: BookmarkFormState = {
  title: "",
  url: "",
  visibility: "private",
}

export function BookmarkDialog({
  open,
  bookmark,
  submitting,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  bookmark: BookmarkRecord | null
  submitting: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: BookmarkFormState) => Promise<void>
}) {
  const [values, setValues] = useState<BookmarkFormState>(emptyState)
  const [errors, setErrors] = useState<Partial<Record<keyof BookmarkFormState, string>>>({})

  useEffect(() => {
    setValues(
      bookmark
        ? {
            title: bookmark.title,
            url: bookmark.url,
            visibility: bookmark.visibility,
          }
        : emptyState
    )
    setErrors({})
  }, [bookmark, open])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof BookmarkFormState, string>> = {}

    if (!values.title.trim()) {
      nextErrors.title = "Title is required"
    }

    try {
      new URL(values.url)
    } catch {
      nextErrors.url = "Enter a valid URL"
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    await onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bookmark ? "Edit bookmark" : "Add bookmark"}</DialogTitle>
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
              onChange={(event) => setValues({ ...values, title: event.target.value })}
            />
            {errors.title ? <p className="text-sm text-destructive">{errors.title}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookmark-url">URL</Label>
            <Input
              id="bookmark-url"
              value={values.url}
              aria-invalid={Boolean(errors.url)}
              placeholder="https://example.com"
              onChange={(event) => setValues({ ...values, url: event.target.value })}
            />
            {errors.url ? <p className="text-sm text-destructive">{errors.url}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookmark-visibility">Visibility</Label>
            <select
              id="bookmark-visibility"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={values.visibility}
              onChange={(event) =>
                setValues({
                  ...values,
                  visibility: event.target.value as BookmarkVisibility,
                })
              }
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
