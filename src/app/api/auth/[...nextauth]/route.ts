import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextRequest, NextResponse } from "next/server"; // ✅ Import Next.js request/response types
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connect();

          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            existingUser = new User({
              fullName: user.name,
              email: user.email,
              googleId: account.providerAccountId,
              mobileNumber: "Not Provided",
              password: "GoogleOAuth",
            });

            await existingUser.save();
            console.log("✅ New Google user saved!");
          }

          return true;
        } catch (error) {
          console.error("❌ Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
  },
};

// ✅ Fix export by using Next.js API Route format
const handler = NextAuth(authOptions);

export async function GET(req: NextRequest) {
  return handler(req as any, {} as any);
}

export async function POST(req: NextRequest) {
  return handler(req as any, {} as any);
}
