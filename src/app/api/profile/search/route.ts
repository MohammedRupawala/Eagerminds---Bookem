import { NextResponse } from "next/server"

import { searchUsers } from "@/lib/db/users"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q") ?? ""
  const users = await searchUsers(query)


  console.log(`Search query: ${query}, Found users: ${users.length}`)
  console.log("Users:", users)
  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      handle: user.handle,
      is_verified: user.is_verified,
    })),
  })
}
