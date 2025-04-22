import { client } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Meeting from "@/lib/models/Meeting";

export async function GET() {
  await client;

  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    return NextResponse.json({ meetings }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch meetings error:", error);
    return NextResponse.json(
      { message: "Failed to fetch meetings", error: error.message },
      { status: 500 }
    );
  }
}
