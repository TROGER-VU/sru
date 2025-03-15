import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import User from "../../../../models/userModel";
import { connect } from "../../../../dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        // Extract user data from the token
        const tokenData = await getDataFromToken(request);
        console.log(tokenData);

        if (!tokenData) {
            return NextResponse.json({ error: "Unauthorized: No valid token" }, { status: 401 });
        }

        const { id, email, source } = tokenData;

        let user;
        if (source === "google") {
            user = await User.findOne({ email }).select("-password").lean();
        } else {
            user = await User.findById(id).select("-password").lean();
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "User found",
            data: user,
        });

    } catch (error: any) {
        console.error("❌ Error fetching user:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
