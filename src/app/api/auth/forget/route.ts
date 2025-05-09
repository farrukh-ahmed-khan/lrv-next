import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/lib/models/User";
import { client } from "@/lib/mongodb";
import sendEmail from "@/lib/email/sendEmail";

export async function POST(req: Request) {
  try {
    await client;

    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `https://lrv-next-kcfx.vercel.app/ResetPassword?token=${token}`;

    // await sendEmail(
    //   user.email,
    //   "Reset Your Password",
    //   `Reset here: ${resetLink}`
    // );

    const emailHTML = `
  <p>You requested a password reset.</p>
  <p>Click the link below to reset your password:</p>
  <a href="${resetLink}" target="_blank" style="color: #007bff;">Reset Your Password</a>
  <p>If you did not request this, please ignore this email.</p>
`;

    await sendEmail(user.email, "Reset Your Password", emailHTML);

    return NextResponse.json({ message: "Reset email sent!" });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
