import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Event from "@/lib/models/Events";
import { verifyToken } from "@/lib/jwt";

export async function DELETE(request: Request) {
    try {
      await client;
  
      const authHeader = request.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);
  
      if (!decoded || decoded.role !== "board member") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
  
      const body = await request.json();
      const { eventId } = body;
  
      if (!eventId) {
        return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
      }
  
      const deleted = await Event.findByIdAndDelete(eventId);
  
      if (!deleted) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Event deleted successfully" });
    } catch (error: any) {
      return NextResponse.json({ message: "Error deleting event", error: error.message }, { status: 500 });
    }
  }
  