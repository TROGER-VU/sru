import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log("Received request body:", reqBody);

        // 1️⃣ **Check if the user is logged in via NextAuth (Google Sign-In)**
        const session = await getServerSession();
        if (session?.user?.email) {
            console.log("✅ Google Auth Session User:", session.user);
            return NextResponse.json({
                message: "Login successful via Google",
                success: true,
            });
        }

        // 2️⃣ **Check if user exists in the database**
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        // 3️⃣ **If user signed up via Google, prevent normal login**
        if (user.googleId) {
            return NextResponse.json({
                error: "Please sign in with Google",
            }, { status: 400 });
        }

        // 4️⃣ **Check if the password is correct**
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
        }

        // 5️⃣ **Create JWT token**
        const tokenData = {
            id: user._id,
            email: user.email,
            points: user.points,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

        // 6️⃣ **Return response with token**
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "strict",
        });

        return response;
    } catch (error: any) {
        console.error("❌ Login Error:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
