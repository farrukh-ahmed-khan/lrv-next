import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Event from "@/lib/models/Events";

export async function POST(req: Request) {
  try {
    await client;
    const { eventId, description } = await req.json();

    if (!eventId || !description) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await Event.findByIdAndUpdate(eventId, { description });

    return NextResponse.json({ message: "Description added successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}
