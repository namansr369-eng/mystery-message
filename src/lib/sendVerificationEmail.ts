import { resend } from "./resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try{
      
      const { data, error } = await resend.emails.send({
         from: 'Acme <onboarding@resend.dev>',
         to: email,
         subject: "Mystery Message | Verification Email",
         react: VerificationEmail({username, verifyCode}),
         });

      return {success: true, message:"Successfully sent verification email"}
    }catch(emailError){
        console.error("Error in sending verification email:",emailError);
        return {success: false, message:"Failed to send verification email"}
    }
}