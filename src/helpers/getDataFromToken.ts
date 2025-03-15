import { getServerSession } from "next-auth"; // ✅ Import from lib/authOptions
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { authOptions } from "../app/lib/authOptions";

export const getDataFromToken = async (request: NextRequest) => {
    try {
        // 1️⃣ **Check if the user is logged in via NextAuth (Google Sign-In)**
        const session = await getServerSession(authOptions); // ✅ Now it works correctly
        if (session?.user?.email) {
            console.log("✅ Google Auth Session User:", session.user);
            return { email: session.user.email, source: "google" };
        }

        // 2️⃣ **Check for a JWT token (Normal Login)**
        const token =
            request.cookies.get("token")?.value ||
            request.cookies.get("next-auth.session-token")?.value ||
            request.cookies.get("__Secure-next-auth.session-token")?.value || ""; // Cookie token

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
