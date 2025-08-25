// /api/upcoming-events/get (example route)
import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import UpcomingEvent from "@/lib/models/UpcomingEvent";

export async function GET() {
  try {
    await client;

    const events = await UpcomingEvent.find()
      .populate("rsvps.userId", "name email") // ✅ bring user details
      .lean();

    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch events", error: error.message },
      { status: 500 }
    );
  }
}
