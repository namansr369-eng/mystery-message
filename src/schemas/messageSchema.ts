import {z} from "zod"

export const messageSchema = z.object({
    content: z
    .string()
    .min(10, {error: "content must be at least of 10 characters"})
    .max(300, {error: "Content must not be longer than 300 character"}),
})