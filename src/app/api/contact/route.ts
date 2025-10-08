import { NextResponse } from "next/server";
import { client } from "../../../lib/mongodb";
import Contact from "../../../lib/models/Contact";

// ✅ POST: Save new contact form entry
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

    const newContact = new Contact({
      fullName,
      email,
      phone,
      message,
    });

    await newContact.save();

    return NextResponse.json(
      { message: "Thank you for contacting us!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { message: "Failed to submit contact form", error: error.message },
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
