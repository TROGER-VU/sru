import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
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
          await connect(); // Ensure DB connection is established

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
          } else {
            console.log("🔹 Existing Google user found:", existingUser.email);
          }

          return true; // Allow login
        } catch (error) {
          console.error("❌ Error during Google sign-in:", error);
          return false; // Block login if error occurs
        }
      }
      return true; // Default return for other providers
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
