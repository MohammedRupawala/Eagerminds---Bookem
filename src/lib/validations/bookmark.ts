import { z } from "zod"

export const bookmarkVisibilitySchema = z.enum(["public", "private"])

export const createBookmarkSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title is too long"),
  url: z.url("Enter a valid URL"),
  visibility: bookmarkVisibilitySchema.default("private"),
})

export const updateBookmarkSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(255, "Title is too long").optional(),
    url: z.url("Enter a valid URL").optional(),
    visibility: bookmarkVisibilitySchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update",
  })

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>
