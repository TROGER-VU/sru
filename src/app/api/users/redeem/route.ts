import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        await connect(); // Ensure DB connection

        const tokenData = await getDataFromToken(req);

        if (!tokenData) {
            return NextResponse.json({ error: "Unauthorized: No valid token" }, { status: 401 });
        }

        const { id, email, source } = tokenData;
        // console.log(req.json());
        const { company, label, pointsUsed } = await req.json();
        if (!company || !label || !pointsUsed) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        let user;
        if (source === "google") {
            user = await User.findOne({ email }).select("-password");
        } else {
            user = await User.findOne({ _id: id }).select("-password");
        }

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (user.points < pointsUsed) {
            return NextResponse.json({ success: false, message: "Insufficient points for this redemption" }, { status: 400 });
        }

        // Generate unique 8-character code
        const redemptionCode = crypto.randomBytes(4).toString("hex").toUpperCase();

        // Set expiry date 3 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3);

        // Deduct points and push to scanHistory
        user.points -= pointsUsed;
        user.scanHistory.push({
            timestamp: new Date(),
            company: company,
            label: label,
            points: -pointsUsed,
            code: redemptionCode,
            expiry: expiryDate
        });
        
        
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Redemption successful",
            company: company,
            label: label,
            code: redemptionCode,
            expiry: expiryDate
        }, {status: 200 });

    } catch (error) {
        console.error("Error processing redemption:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}