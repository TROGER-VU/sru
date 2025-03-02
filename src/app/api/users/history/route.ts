import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

export async function GET(req: NextRequest) {
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

        return NextResponse.json({ success: true, history: user.scanHistory }, { status: 200 });

    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
