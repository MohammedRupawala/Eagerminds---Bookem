import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getSession } from "@/lib/session";
import { deleteBookmark, updateBookmark } from "@/lib/db/bookmarks";
import { updateBookmarkSchema } from "@/lib/validations/bookmark";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const input = updateBookmarkSchema.parse(await request.json());
    const bookmark = await updateBookmark(id, session.sub, input);

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ bookmark });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input", issues: error.issues },
        { status: 400 },
      );
    }

    console.error("Update bookmark failed", error);
    return NextResponse.json(
      { error: "Could not update bookmark" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteBookmark(id, session.sub);

    if (!deleted) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete bookmark failed", error);
    return NextResponse.json(
      { error: "Could not delete bookmark" },
      { status: 500 },
    );
  }
}
