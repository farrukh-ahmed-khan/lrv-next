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

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/ResetPassword?token=${token}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `Reset here: ${resetLink}`
    );

    return NextResponse.json({ message: "Reset email sent!" });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
