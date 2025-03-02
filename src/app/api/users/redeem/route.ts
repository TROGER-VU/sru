import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        await connect(); // Ensure DB connection

        // Extract user ID from token
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Find user in the database
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Check if the user has at least 100 points
        if (user.points < 100) {
            return NextResponse.json({ success: false, message: "Insufficient points for redemption" }, { status: 400 });
        }

        // Generate a unique 8-character alphanumeric redemption code
        const redemptionCode = crypto.randomBytes(4).toString("hex").toUpperCase();

        // Set expiration date (3 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3);

        // Log redemption event in history
        user.scanHistory.push({
            timestamp: new Date(),
            points: -user.points, // Deducted points
            code: redemptionCode,
            expiry: expiryDate
        });

        // Reset user's points to zero
        user.points = 0;

        await user.save();

        return NextResponse.json({ 
            success: true, 
            message: "Redemption successful", 
            code: redemptionCode,
            expiry: expiryDate
        }, { status: 200 });

    } catch (error) {
        console.error("Error processing redemption:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
