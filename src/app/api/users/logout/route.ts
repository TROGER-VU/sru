import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Create a new response instance
        const response = new NextResponse(
            JSON.stringify({
                message: "Logout successful",
                success: true,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // ✅ Properly remove cookies
        response.cookies.delete("token");
        response.cookies.delete("next-auth.session-token");
        response.cookies.delete("__Secure-next-auth.session-token");

        return response;
    } catch (error: any) {
        console.error("❌ Logout Error:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
