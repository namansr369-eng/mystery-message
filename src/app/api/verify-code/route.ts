import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const isVerifiedSchema = z.object({
   username: usernameValidation, // Reusing the username validation rule
  code: z.string().length(6, { message: "Verification code must be 6 digits" }),
});
export async function GET(request: Request) {
  await dbConnect();

  try {

    const { searchParams } = new URL(request.url);
       const queryParam = {
        username: searchParams.get("username") || "",
        code: searchParams.get("code") || "",
       }

    const result = isVerifiedSchema.safeParse(queryParam);

    if (!result.success) {
        const errorTree = z.treeifyError(result.error);
        const usernameError = errorTree?.properties?.username?.errors;
        const codeError = errorTree?.properties?.code?.errors;

        return Response.json({
            success: false,
            message: [
                ...(usernameError?.length ? usernameError : []),
                ...(codeError?.length ? codeError : [])
            ].join(", ") || "Invalid Username or Code"
        }, { status: 400 });
       }

    const { username, code } = result.data;

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "User verification code expired, SignUp again to get new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying code", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code",
      },
      { status: 500 }
    );
  }
}
