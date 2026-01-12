import { NextResponse } from "next/server";
import { client } from "../../../lib/mongodb";
import Contact from "../../../lib/models/Contact";
import { transporter } from "../../../lib/mail";

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, message } = await req.json();

    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await client;

    // Save to DB
    const newContact = new Contact({
      fullName,
      email,
      phone,
      message,
    });
    await newContact.save();

    // 📧 Send Email
    await transporter.sendMail({
      from: `"LRV" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: "pgattu@gmail.com",
      replyTo: email,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json(
      { message: "Thank you for contacting us!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { message: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

// ✅ GET: Fetch all contact form submissions
export async function GET() {
  try {
    await client;
    const contacts = await Contact.find().sort({ createdAt: -1 }); // newest first

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { message: "Failed to fetch contact data", error: error.message },
      { status: 500 }
    );
  }
}
