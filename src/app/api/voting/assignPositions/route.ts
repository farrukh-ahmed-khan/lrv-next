import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  await client;

  try {
    const { email, position } = await req.json();

    if (!email || !position) {
      return NextResponse.json(
        { message: "Email and position are required" },
        { status: 400 }
      );
    }

    const updated = await User.updateOne(
      { email },
      { $set: { position } },
      { strict: false }
    );

    if (updated.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: `Position updated for ${email}` },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to update position" },
      { status: 500 }
    );
  }
}
