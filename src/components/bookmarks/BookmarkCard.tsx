"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";

import type { BookmarkRecord } from "@/lib/db/bookmarks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
}: {
  bookmark: BookmarkRecord;
  onEdit: (bookmark: BookmarkRecord) => void;
  onDelete: (bookmark: BookmarkRecord) => void;
}) {
  return (
    <Card className="card-hover group flex h-full flex-col shadow-sm">
      <CardHeader className="min-h-28 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-base">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              {bookmark.title}
              <ExternalLink className="size-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
            </a>
          </CardTitle>
          <Badge
            variant={bookmark.visibility === "public" ? "default" : "secondary"}
            className="shrink-0 text-xs"
          >
            {bookmark.visibility === "public" ? "Public" : "Private"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="truncate text-sm text-muted-foreground">{bookmark.url}</p>
      </CardContent>
      <CardFooter className="justify-end gap-2 opacity-80 transition-opacity group-hover:opacity-100">
        <Button
          variant="outline"
          size="sm"
          className="transition-colors hover:border-foreground/30"
          onClick={() => onEdit(bookmark)}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="transition-opacity"
          onClick={() => onDelete(bookmark)}
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
