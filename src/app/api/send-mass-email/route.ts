import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await client;

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "board member") {
      return NextResponse.json(
        { message: "Forbidden: board member only" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { recipientType, street, userIds, subject, message } = body;

    let recipients: any[] = [];

    if (recipientType === "all") {
      recipients = await User.find({ role: "home owner", status: "approved" });
    } else if (recipientType === "street" && street) {
      recipients = await User.find({
        role: "home owner",
        streetAddress: street,
        status: "approved",
      });
    } else if (recipientType === "specific" && Array.isArray(userIds)) {
      recipients = await User.find({
        _id: { $in: userIds },
        role: "home owner",
        status: "approved",
      });
    } else {
      return NextResponse.json(
        { message: "Invalid recipient selection" },
        { status: 400 }
      );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { message: "No recipients found" },
        { status: 404 }
      );
    }

    const emails = recipients.map((user) => user.email);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || "587"),
      secure: false, 
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: emails, 
        subject,
        html: `<p>${message}</p>`,
      });
      
    return NextResponse.json({ message: "Emails sent successfully" });
  } catch (error: any) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { message: "Failed to send emails", error: error.message },
      { status: 500 }
    );
  }
}
