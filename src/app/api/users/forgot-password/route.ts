import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/userModel";

export async function POST(req: Request) {
  await connect();
  const { email } = await req.json();

  if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

  // Find user
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Generate a secure token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.forgotPasswordToken = resetToken;
  user.forgotPasswordTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // Token expires in 15 mins
  await user.save();

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  // Configure email transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  return NextResponse.json({ message: "Reset link sent to email" });
}
