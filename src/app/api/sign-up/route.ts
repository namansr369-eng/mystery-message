import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
      console.log("Received data:", { username, email, password });
    // Check for a verified username first
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken and verified.",
        },
        { status: 400 }
      );
    }

    // Now, check if a user with that email already exists
    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email.",
          },
          { status: 400 }
        );
      } else {
        // User exists but is not verified; update password and verification code
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.username = username; // Update username as well
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour

        await existingUserByEmail.save();
      }
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email to the user (both new and existing but unverified)
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (err) {

    console.error("Error registering user", err);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}