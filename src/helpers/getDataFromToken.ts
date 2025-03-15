import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { authOptions } from "../app/lib/authOptions";
import { getToken } from 'next-auth/jwt';

export const getDataFromToken = async (request: NextRequest) => {
    try {
        // 1️⃣ **Check if the user is logged in via NextAuth (Google Sign-In)**
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            console.log("✅ Google Auth Session User:", session.user);
            return { email: session.user.email, source: "google" };
        }

        // 2️⃣ **Check for a JWT token (Normal Login)**
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            throw new Error("No authentication token found");
        }

        console.log("✅ Normal Login User:", token);
        return { id: token.sub, email: token.email, source: "credentials" };
    } catch (error: any) {
        console.error("❌ Authentication Error:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("Invalid token");
        } else if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Token expired");
        }
        throw new Error(error.message);
    }
};