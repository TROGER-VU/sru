import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

export async function POST(req: NextRequest) {
    try {
        await connect(); // Ensure DB connection

        // Extract user ID from token (✅ Fixed missing await)
        const tokenData = await getDataFromToken(req);
        if (!tokenData) {
            return NextResponse.json({ error: "Unauthorized: No valid token" }, { status: 401 });
        }

        const { id, email, source } = tokenData;

        // Find user in the database before parsing the request body
        let user;
        if (source === "google") {
            user = await User.findOne({ email }).select("-password");
        } else {
            user = await User.findOne({ _id: id }).select("-password");
        }

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Parse request body safely
        let qrCode;
        try {
            const body = await req.json();
            qrCode = body.qrCode;
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
        }

        if (!qrCode) {
            return NextResponse.json({ success: false, message: "QR Code is required" }, { status: 400 });
        }

        // Ensure scanHistory is initialized
        user.scanHistory = user.scanHistory || [];

        // Update points and log history
        user.points = (user.points || 0) + 1; // ✅ Handle undefined points
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
