import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import User from "@/lib/models/User";
import { client } from "@/lib/mongodb";
import crypto from "crypto";
import sendEmail from "@/lib/email/sendEmail";

export async function POST(req: Request) {
  try {
    await client;

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "home owner") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/ResetPassword?token=${resetToken}`;
    const emailHTML = `
            <p>Hi ${user.firstname},</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}" target="_blank" style="color: #007bff;">Reset Your Password</a>
            <p>This link will expire in 1 hour.</p>
        `;

    await sendEmail(user.email, "Reset Your Password", emailHTML);

    return NextResponse.json(
      { message: "Reset email resent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend Reset Email Error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
