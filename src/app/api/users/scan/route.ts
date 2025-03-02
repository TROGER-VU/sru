import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

export async function POST(req: NextRequest) {
    try {
        await connect(); // Ensure DB connection

        // Extract user ID from token
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { qrCode } = await req.json(); // Extract QR Code from request body
        if (!qrCode) {
            return NextResponse.json({ success: false, message: "QR Code is required" }, { status: 400 });
        }

        // Find user in the database
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Update points and log history
        user.points += 1; // Increase points per scan
        user.scanHistory.push({
            timestamp: new Date(),
            points: 1,
        });

        await user.save();

        return NextResponse.json({ success: true, points: user.points }, { status: 200 });
    } catch (error) {
        console.error("Error scanning QR:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
