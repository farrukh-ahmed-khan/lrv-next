import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import UpcomingEvent from "@/lib/models/UpcomingEvent";

export async function GET() {
  try {
    await client;
    const events = await UpcomingEvent.find().sort({ date: 1 });
    return NextResponse.json({ events });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
