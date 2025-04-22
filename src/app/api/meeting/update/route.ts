import { NextResponse } from "next/server";
import { client } from "../../../../lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Meeting from "@/lib/models/Meeting";

export async function PUT(req: Request) {
  try {
    await client;

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || !["admin", "board member"].includes(decoded.role)) {
      return NextResponse.json(
        {
          message: "Forbidden: Only admin or board member can update meetings",
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const id = formData.get("id")?.toString();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();

    if (!id || !title || !description) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedMeeting) {
      return NextResponse.json(
        { message: "Meeting not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Meeting updated successfully", updatedMeeting },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during meeting update:", error);
    return NextResponse.json(
      { message: "Meeting update failed", error: error.message },
      { status: 500 }
    );
  }
}
