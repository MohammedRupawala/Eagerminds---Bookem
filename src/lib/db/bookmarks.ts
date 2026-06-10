import { getSupabaseAdminClient } from "@/lib/db/client"

export type BookmarkVisibility = "public" | "private"

export type BookmarkRecord = {
  id: string
  title: string
  url: string
  visibility: BookmarkVisibility
  user_id: string
  created_at: string
  updated_at: string
}

export async function getBookMarkByTitle(name: string) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("title", name)
    .maybeSingle<BookmarkRecord>()

  if (error) {
    throw error
  }

  return data
}

export async function getBookmarkByURL(id: string) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("url", id)
    .maybeSingle<BookmarkRecord>()

  if (error) {
    throw error
  }
  
  return data
}

export async function getBookmarksByUserId(userId: string) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<BookmarkRecord[]>()

  if (error) {
    throw error
  }

  return data
}

export async function createBookmark(input: {
  userId: string
  title: string
  url: string
  visibility: BookmarkVisibility
}) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: input.userId,
      title: input.title,
      url: input.url,
      visibility: input.visibility,
    })
    .select("*")
    .single<BookmarkRecord>()

  if (error) {
    throw error
  }

  return data
}

export async function getBookmarkByIdAndUserId(id: string, userId: string) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle<BookmarkRecord>()

  if (error) {
    throw error
  }

  return data
}

export async function updateBookmark(
  id: string,
  userId: string,
  input: Partial<Pick<BookmarkRecord, "title" | "url" | "visibility">>
) {
  const existing = await getBookmarkByIdAndUserId(id, userId)

  if (!existing) {
    return null
  }

  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("bookmarks")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single<BookmarkRecord>()

  if (error) {
    throw error
  }

  return data
}

export async function deleteBookmark(id: string, userId: string) {
  const existing = await getBookmarkByIdAndUserId(id, userId)

  if (!existing) {
    return false
  }

  const supabase = getSupabaseAdminClient()
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    throw error
  }

  return true
}

export async function getPublicBookmarksByHandle(handle: string) {
  const supabase = getSupabaseAdminClient()
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id,name,handle")
    .eq("handle", handle.toLowerCase())
    .maybeSingle<{ id: string; name: string; handle: string }>()

  if (userError) {
    throw userError
  }

  if (!user) {
    return null
  }

  const { data: bookmarks, error: bookmarksError } = await supabase
    .from("bookmarks")
    .select("id,title,url,visibility,user_id,created_at,updated_at")
    .eq("user_id", user.id)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .returns<BookmarkRecord[]>()

  if (bookmarksError) {
    throw bookmarksError
  }

  return {
    user: {
      name: user.name,
      handle: user.handle,
    },
    bookmarks,
  }
}
