import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import UpcomingEvent from "@/lib/models/UpcomingEvent";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await client;

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { eventId, status } = body;

    if (!eventId || !["attended", "not attended"].includes(status)) {
      return NextResponse.json(
        { message: "Event ID and valid status are required" },
        { status: 400 }
      );
    }

    const event = await UpcomingEvent.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const existingRSVP = event.rsvps.find(
      (r: any) => r.userId.toString() === decoded.id
    );

    if (existingRSVP) {
      existingRSVP.status = status; // update status
    } else {
      event.rsvps.push({ userId: decoded.id, status });
    }

    await event.save();

    return NextResponse.json({
      message: "RSVP updated successfully",
      event,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update RSVP", error: error.message },
      { status: 500 }
    );
  }
}
