import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Library from "@/lib/models/Library";
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
      const { libraryId } = body;
  
      if (!libraryId) {
        return NextResponse.json({ message: "Library ID is required" }, { status: 400 });
      }
  
      const deleted = await Library.findByIdAndDelete(libraryId);
  
      if (!deleted) {
        return NextResponse.json({ message: "Library not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Library deleted successfully" });
    } catch (error: any) {
      return NextResponse.json({ message: "Error deleting library", error: error.message }, { status: 500 });
    }
  }
  