import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Event from "@/lib/models/Events";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await client;

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
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

    const body = await request.json();

    const { eventname } = body;

    if (!eventname) {
      return NextResponse.json(
        { message: "Event name is required" },
        { status: 400 }
      );
    }

    const newEvent = await Event.create({
      eventname,
      userId: decoded.id
     });

    return NextResponse.json({
      message: "Event added successfully",
      event: newEvent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add event", error: error.message },
      { status: 500 }
    );
  }
}
