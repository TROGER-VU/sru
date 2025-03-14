import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import User from "../../../../models/userModel";
import { connect } from "../../../../dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        const { id, email, source } = await getDataFromToken(request);

        let user;
        if (source === "google") {
            user = await User.findOne({ email }).select("-password");
        } else {
            user = await User.findOne({ _id: id }).select("-password");
        }

        if (!user) {
            throw new Error("User not found");
        }

        return NextResponse.json({
            message: "User found",
            data: user,
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
