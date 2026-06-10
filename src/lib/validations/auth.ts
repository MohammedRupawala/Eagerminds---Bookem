import { z } from "zod"

const handleSchema = z
  .string()
  .trim()
  .min(3, "Handle must be at least 3 characters")
  .max(50, "Handle must be 50 characters or fewer")
  .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores only")

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255, "Name is too long"),
  email: z.email("Enter a valid email").transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
  handle: handleSchema.transform((handle) => handle.toLowerCase()),
})

export const loginSchema = z.object({
  email: z.email("Enter a valid email").transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Password is required"),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
