"use client"

import { ExternalLink, Pencil, Trash2 } from "lucide-react"

import type { BookmarkRecord } from "@/lib/db/bookmarks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
}: {
  bookmark: BookmarkRecord
  onEdit: (bookmark: BookmarkRecord) => void
  onDelete: (bookmark: BookmarkRecord) => void
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="min-h-28 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-base">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              {bookmark.title}
              <ExternalLink className="size-3.5" />
            </a>
          </CardTitle>
          <Badge variant={bookmark.visibility === "public" ? "default" : "secondary"}>
            {bookmark.visibility === "public" ? "Public" : "Private"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="truncate text-sm text-muted-foreground">{bookmark.url}</p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(bookmark)}>
          <Pencil />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(bookmark)}>
          <Trash2 />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
