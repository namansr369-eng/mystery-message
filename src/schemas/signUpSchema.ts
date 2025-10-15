import {z} from "zod";


// since here we are only validation the single field thus we haven't used the .object method of zod.
export const usernameValidation = z
        .string()
        .min(2, "Username must be at least 2 characters")
        .max(20, "Username must be no more than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
   username : usernameValidation, //reusing the already defined zod schema
   email: z.email({error:"Invalid email address."}), // no .email() method has its own schema and can't be chained with string instead it has it's own string validation.
   password: z.string().min(6, {error: "password must be at least of 6 characters"})
})