import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Library from "@/lib/models/Library";

export async function GET() {
  try {
    await client;
    const librarys = await Library.find().sort({ createdAt: -1 });
    return NextResponse.json(librarys);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch librarys", error: error.message },
      { status: 500 }
    );
  }
}
