import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

connect();

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        // Find user with token
        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            // Token is invalid or expired
            // Check if token exists at all and if it is expired, remove it.
            const expiredUser = await User.findOne({forgotPasswordToken: token});
            if (expiredUser) {
                expiredUser.forgotPasswordToken = undefined;
                expiredUser.forgotPasswordTokenExpiry = undefined;
                await expiredUser.save();
            }

            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and clear token
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: "Password reset successful!" }, { status: 200 });
    } catch (error: any) {
        console.error("❌ Password reset error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}