import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route"; // Adjust path if needed
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = async (request: NextRequest) => {
    try {
        // 1️⃣ **Check if the user is logged in via NextAuth (Google Sign-In)**
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            console.log("✅ Google Auth Session User:", session.user);
            return { email: session.user.email, source: "google" };
        }

        // 2️⃣ **Check for a JWT token (Normal Login)**
        const token =
            request.headers.get("Authorization")?.split(" ")[1] || // Bearer token
            request.cookies.get("token")?.value || ""; // Cookie token

        if (!token) {
            throw new Error("No authentication token found");
        }

        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        console.log("✅ Normal Login User:", decodedToken);
        return { id: decodedToken.id, email: decodedToken.email, source: "jwt" };
    } catch (error: any) {
        console.error("❌ Authentication Error:", error.message);
        throw new Error(error.message);
    }
};
