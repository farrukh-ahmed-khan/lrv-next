import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Dues from "@/lib/models/Dues";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    await client;

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const url = new URL(request.url);
    const dueId = url.pathname.split("/")[3];

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ message: "Missing userId in body" }, { status: 400 });
    }

    const due = await Dues.findOne({
      _id: dueId,
      userId: userId, // use userId from body
    });

    if (!due) {
      return NextResponse.json({ message: "Due not found" }, { status: 404 });
    }

    return NextResponse.json(due, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching due:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
