import {z} from "zod"

export const signIndSchema = z.object({
    identifier: z.string(),
    password: z.string(),
})