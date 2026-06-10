"use client"

import { ArrowLeft, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
      <ArrowLeft />
      Back
    </Button>
  )
}

export function LogoutButton() {
  const router = useRouter()

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Could not log out")
      }

      router.push("/login")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not log out")
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={logout}>
      <LogOut />
      Logout
    </Button>
  )
}
