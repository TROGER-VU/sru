import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "../../dbConfig/dbConfig";
import User from "../../models/userModel";
import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                try {
                    await connect();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) return null; // User not found

                    const isPasswordMatch = await bcryptjs.compare(credentials.password, user.password);
                    if (!isPasswordMatch) return null; // Incorrect password

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.fullName,
                    };
                } catch (error: any) {
                    console.error("Error during credentials login:", error);
                    return null;
                }
            },
            credentials: undefined,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                await connect();
                let existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    // New Google User → Create a new record
                    existingUser = new User({
                        fullName: user.name,
                        email: user.email,
                        googleId: account?.providerAccountId,
                        mobileNumber: `google_${account?.providerAccountId}`.slice(0, 10),
                    });
                    await existingUser.save();
                    console.log("✅ New Google user saved!");
                } else if (!existingUser.googleId) {
                    // Existing user (registered via email/password) logging in via Google
                    existingUser.googleId = account?.providerAccountId;
                    await existingUser.save();
                    console.log("✅ Google login linked to existing account!");
                }

                return true;
            } catch (error) {
                console.error("❌ Error during Google login:", error);
                return false;
            }
        },
    },
};

export default NextAuth(authOptions);
