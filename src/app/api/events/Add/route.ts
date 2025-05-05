import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Event from "@/lib/models/Events";

export async function POST(request: Request) {
  try {
    await client;
    const body = await request.json();

    const { eventname } = body;

    if (!eventname) {
      return NextResponse.json(
        { message: "Event name is required" },
        { status: 400 }
      );
    }

    const newEvent = await Event.create({ eventname });

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
