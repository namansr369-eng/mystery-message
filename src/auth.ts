import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./lib/dbConnect";
import UserModel from "./model/User";

export const { handlers, signIn, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },

      authorize: async (credentials: any): Promise<any> => {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.email },
            ],
          });
          if (!user) {
            throw new Error("NO_USER");
          }
          if (!user.isVerified) {
            throw new Error("NOT_VERIFIED");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("INVALID_PASSWORD");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}){
      if(user){
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({session, token}){
      if (token) {
        session.user._id = token._id as string | undefined;
        session.user.isVerified = token.isVerified as boolean | undefined;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean | undefined;
        session.user.username = token.username as string | undefined; 
      }
      return session
    },
    
  },
  pages: {
    signIn: "/sign-in",  // Custom sign-in page
  },
  session: {
      strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET
});
