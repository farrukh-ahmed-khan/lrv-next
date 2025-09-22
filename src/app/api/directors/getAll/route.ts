import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Directors from "@/lib/models/Directors";

export async function GET() {
  try {
    await client;
    const directors = await Directors.find().sort({ date: 1 });
    return NextResponse.json({ directors });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
