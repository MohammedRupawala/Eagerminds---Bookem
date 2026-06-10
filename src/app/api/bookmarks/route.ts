import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { getSession } from "@/lib/auth"
import { createBookmark, getBookmarksByUserId, getBookmarkByURL, getBookMarkByTitle } from "@/lib/db/bookmarks"
import { createBookmarkSchema } from "@/lib/validations/bookmark"

export const runtime = "nodejs"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bookmarks = await getBookmarksByUserId(session.sub)
  return NextResponse.json({ bookmarks })
}

export async function POST(request: Request) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {

    const input = createBookmarkSchema.parse(await request.json())

    console.log("Creating bookmark with input:", input)
    
    const checkExistingByURL =  await getBookmarkByURL(input.url)
    if (checkExistingByURL) {
      return NextResponse.json({ error: "Bookmark with this URL already exists" }, { status: 409 })
    }
    const checkExistingByTitle =  await getBookMarkByTitle(input.title)
    if (checkExistingByTitle) {
      return NextResponse.json({ error: "Bookmark with this title already exists" }, { status: 409 })
    }
    const bookmark = await createBookmark({
      userId: session.sub,
      title: input.title,
      url: input.url,
      visibility: input.visibility,
    })

    return NextResponse.json({ bookmark }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input", issues: error.issues }, { status: 400 })
    }

    console.error("Create bookmark failed", error)
    return NextResponse.json({ error: "Could not create bookmark" }, { status: 500 })
  }
}
