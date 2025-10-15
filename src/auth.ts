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
          type: "username",
          label: "Username",
          placeholder: "johndoe",
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
              { username: credentials.username },
            ],
          });
          if (!user) {
            return null;
          }
          if (!user.isVerified) {
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            return null;
          }
        } catch (err: any) {
          console.error("Error in authorize function: ", err.message);
          return null;
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
