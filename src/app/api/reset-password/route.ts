import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "../../../dbConfig/dbConfig";
import User from "../../../models/userModel";

export async function POST(req: Request) {
  await connect();
  const { token, password } = await req.json();

  if (!token || !password) return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  // Find user with token
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });

  if (!user) return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update password and clear token
  user.password = hashedPassword;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;
  await user.save();

  return NextResponse.json({ message: "Password reset successful!" });
}
