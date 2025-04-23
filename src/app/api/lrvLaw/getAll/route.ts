import { client } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Lrvlaw from "@/lib/models/LrvLaw";


export async function GET() {
  await client;

  try {
    const lrvlaw = await Lrvlaw.find().sort({ createdAt: -1 });
    return NextResponse.json({ lrvlaw }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch lrvlaw error:", error);
    return NextResponse.json(
      { message: "Failed to fetch lrvlaw", error: error.message },
      { status: 500 }
    );
  }
}
