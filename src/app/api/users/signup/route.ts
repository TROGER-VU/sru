// /api/users/signup.ts (or .js)

import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { fullName, email, mobileNumber, password, source } = reqBody;

        // Input validation
        if (!fullName || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
        }

        // Validate mobileNumber for credential signups (not Google)
        if (source !== "google" && !mobileNumber) {
            return NextResponse.json({ error: "Mobile number is required for credential signups" }, { status: 400 });
        }

        // Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            mobileNumber,
            password: hashPassword,
        });

        const savedUser = await newUser.save();

        return NextResponse.json(
            {
                message: "User created successfully",
                success: true,
                savedUser,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("❌ Registration Error:", error);
        if (error.name === "ValidationError") {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}