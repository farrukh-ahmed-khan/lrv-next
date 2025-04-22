import { client } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import Meeting from "@/lib/models/Meeting";

export async function DELETE(req: Request) {
  await client;

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || !["admin", "board member"].includes(decoded.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url || "");
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json(
      { message: "Meeting ID is required" },
      { status: 400 }
    );

  try {
    const meeting = await Meeting.findByIdAndDelete(id);
    if (!meeting)
      return NextResponse.json(
        { message: "Meeting not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "Meeting deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 }
    );
  }
}
