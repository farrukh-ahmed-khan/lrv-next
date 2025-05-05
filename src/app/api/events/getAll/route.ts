import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Event from "@/lib/models/Events";

export async function GET() {
  try {
    await client;
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch events", error: error.message },
      { status: 500 }
    );
  }
}
