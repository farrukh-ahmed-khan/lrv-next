import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Directors from "@/lib/models/Directors";

export async function DELETE(req: Request) {
  try {
    await client;

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "board member") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Parse request body to get eventId
    const { directorId } = await req.json();

    if (!directorId) {
      return NextResponse.json({ message: "Director ID is required" }, { status: 400 });
    }

    const deletedEvent = await Directors.findByIdAndDelete(directorId);

    if (!deletedEvent) {
      return NextResponse.json({ message: "Director not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Director deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
