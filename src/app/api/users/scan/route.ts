import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

export async function POST(req: NextRequest) {
    try {
        console.log("⏳ Connecting to DB...");
        await connect();

        console.log("🔐 Extracting token...");
        const tokenData = await getDataFromToken(req);
        if (!tokenData) {
            return NextResponse.json({ error: "Unauthorized: No valid token" }, { status: 401 });
        }

        const { id, email, source } = tokenData;

        console.log("🔍 Looking up user...");
        let user;
        if (source === "google") {
            user = await User.findOne({ email }).select("-password");
        } else {
            user = await User.findOne({ _id: id }).select("-password");
        }

        if (!user) {
            console.log("❌ User not found");
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        console.log("📦 Parsing request body...");
        let qrCode;
        try {
            const body = await req.json();
            qrCode = body.qrCode;
        } catch (err) {
            console.error("⚠️ Failed to parse JSON:", err);
            return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
        }

        if (!qrCode) {
            console.log("❌ No QR code provided");
            return NextResponse.json({ success: false, message: "QR Code is required" }, { status: 400 });
        }

        console.log("✅ QR code received:", qrCode);

        // Default field fallback
        user.points = user.points || 0;
        user.scanHistory = user.scanHistory || [];

        console.log("➕ Updating user points and scanHistory...");
        user.points += 1;
        user.scanHistory.push({
            timestamp: new Date(),
            points: 1,
            company: "SRU",   // or null if optional
            label: "Scan Reward",
        });

        await user.save();
        console.log("✅ User updated and saved!");

        return NextResponse.json({ success: true, points: user.points }, { status: 200 });

    } catch (error) {
        console.error("🔥 Unexpected error during scan:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
