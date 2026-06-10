import { NextResponse } from "next/server"

import { getPublicBookmarksByHandle } from "@/lib/db/bookmarks"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params
  const profile = await getPublicBookmarksByHandle(handle)

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  return NextResponse.json(profile)
}
