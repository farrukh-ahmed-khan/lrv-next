import { client } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Nominee from "@/lib/models/Nominee";

export async function GET() {
  await client;

  try {
    const nominees = await Nominee.find({
      year: new Date().getFullYear(),
    }).sort({ createdAt: -1 });
    return NextResponse.json({ nominees }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch nominees error:", error);
    return NextResponse.json(
      { message: "Failed to fetch nominees", error: error.message },
      { status: 500 }
    );
  }
}
