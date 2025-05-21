import { client } from "@/lib/mongodb";
import Newsletter from "@/lib/models/Newsletter";
import { NextResponse } from "next/server";


export async function GET() {
  await client;

  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    return NextResponse.json({ newsletters }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch newsletters error:", error);
    return NextResponse.json(
      { message: "Failed to fetch newsletters", error: error.message },
      { status: 500 }
    );
  }
}
