import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Dues from "@/lib/models/Dues";

export async function GET() {
  try {
    await client;
    const dues = await Dues.find().sort({ createdAt: -1 });
    return NextResponse.json(dues);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch events", error: error.message },
      { status: 500 }
    );
  }
}
