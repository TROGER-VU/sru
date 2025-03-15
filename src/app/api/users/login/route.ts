import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log("Received request body:", reqBody);

        // 1️⃣ **Check if user exists in the database**
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        // 2️⃣ **If user signed up via Google, prevent normal login**
        if (user.googleId) {
            return NextResponse.json({
                error: "Please sign in with Google",
            }, { status: 400 });
        }

        // 3️⃣ **Check if the password is correct**
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
        }

        // 4️⃣ **Create JWT token**
        const tokenData = {
            id: user._id,
            email: user.email,
            points: user.points,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

        // 5️⃣ **Set Cookie Properly in Vercel**
        const cookie = serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 24 * 60 * 60, // 1 day
        });

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.headers.set("Set-Cookie", cookie);
        return response;
    } catch (error: any) {
        console.error("❌ Login Error:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
