import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import { getSafeUserById } from "@/lib/db/users";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getSafeUserById(session.sub);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
