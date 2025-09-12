import {z} from "zod";


// since here we are only validation the single field thus we haven't used the .object method of zod.
export const usernameValidation = z
        .string()
        .min(2, "Username must be at least 2 characters")
        .max(20, "Username must be no more than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUSchema = z.object({
   username : usernameValidation, //reusing the already defined zod schema
   email: z.string().email({message:"Invalid email address."}),
   password: z.string().min(6, {message: "password must be at least of 6 characters"})
})