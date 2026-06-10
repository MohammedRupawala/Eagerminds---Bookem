import { getSupabaseAdminClient } from "@/lib/db/client"

export type UserRecord = {
  id: string
  name: string
  email: string
  password_hash: string
  handle: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type SafeUser = Omit<UserRecord, "password_hash" | "created_at" | "updated_at">

export async function getUserByEmail(email: string) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle<UserRecord>()

  if (error) {
    throw error
  }

  return data
}

export async function getUserByHandle(handle: string) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("handle", handle.toLowerCase())
    .maybeSingle<UserRecord>()

  if (error) {
    throw error
  }

  return data
}

export async function getSafeUserById(id: string) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("users")
    .select("id,name,email,handle,is_verified")
    .eq("id", id)
    .maybeSingle<SafeUser>()

  if (error) {
    throw error
  }

  return data
}

export async function verifyUserEmail(id: string, email: string) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("users")
    .update({ is_verified: true, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("email", email.toLowerCase())
    .select("id,name,email,handle,is_verified")
    .maybeSingle<SafeUser>()

  if (error) {
    throw error
  }

  return data
}

export async function searchUsers(query: string) {
  const supabase = getSupabaseAdminClient()
  const normalized = query.trim().toLowerCase().replace(/[%,()]/g, "")

  if (normalized.length < 2) {
    return []
  }

  const pattern = `%${normalized}%`
  const { data, error } = await supabase
    .from("users")
    .select("id,name,email,handle,is_verified")
    .or(`handle.ilike.${pattern},name.ilike.${pattern}`)
    .eq("is_verified", true)
    .order("handle", { ascending: true })
    .limit(12)
    .returns<SafeUser[]>()

  
  if (error) {
    throw error
  }

  return data
}

export async function createUser(input: {
  name: string
  email: string
  passwordHash: string
  handle: string
}) {
  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: input.name,
      email: input.email.toLowerCase(),
      password_hash: input.passwordHash,
      handle: input.handle.toLowerCase(),
    })
    .select("*")
    .single<UserRecord>()

  if (error) {
    throw error
  }

  return data
}

export function toSafeUser(user: UserRecord): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    handle: user.handle,
    is_verified: user.is_verified,
  }
}
