import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import UpcomingEvent from "@/lib/models/UpcomingEvent";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    await client;

    // ✅ Check if user is logged in (optional)
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        userId = decoded?.id || null;
      } catch {
        userId = null; // ignore invalid token, still allow fetching
      }
    }

    // ✅ Fetch only upcoming events (date >= today)
    const today = new Date();
    const events = await UpcomingEvent.find({ date: { $gte: today } })
      .sort({ date: 1 })
      .lean();

    // ✅ Attach RSVP status for current user
    const eventsWithRSVP = events.map((event: any) => {
      let myStatus: string | null = null;
      if (userId) {
        const rsvp = event.rsvps?.find(
          (r: any) => r.userId.toString() === userId
        );
        if (rsvp) myStatus = rsvp.status;
      }
      return { ...event, myRSVP: myStatus };
    });

    return NextResponse.json({ events: eventsWithRSVP }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch events", error: error.message },
      { status: 500 }
    );
  }
}
