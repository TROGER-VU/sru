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

                    if (!user) {
                        return null; // User not found
                    }

                    const isPasswordMatch = await bcryptjs.compare(credentials.password, user.password);

                    if (isPasswordMatch) {
                        return {
                            id: user._id.toString(), // Assuming your User model uses _id
                            email: user.email,
                            name: user.fullName,
                        };
                    } else {
                        return null; // Incorrect password
                    }
                } catch (error: any) {
                    console.error("Error during credentials login:", error);
                    return null; // Handle error appropriately
                }
            },
            credentials: undefined
        }),
    ],
    session: {
        strategy: "jwt",
    },
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
                            mobileNumber: "Not Needed",
                            password: "GoogleOAuth",
                        });

                        await existingUser.save();
                        console.log("New Google user saved!");
                    }
                    return true;
                } catch (error) {
                    console.error("Error while creating user:", error);
                    throw new Error("Error while creating user");
                }
            }
            return true;
        },
    },
};

export default NextAuth(authOptions);