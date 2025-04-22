import { NextResponse } from "next/server";
import { client } from "../../../../lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Meeting from "@/lib/models/Meeting";

export async function POST(req: Request) {
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
          message:
            "Forbidden: Only admin or board member can access this route",
        },
        { status: 403 }
      );
    }

    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const newMeeting = new Meeting({
      title,
      description,
      uploadedBy: decoded.id,
    });

    await newMeeting.save();

    return NextResponse.json(
      {
        message: "Meeting Added",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error during meeting generation:", error);
    return NextResponse.json(
      { message: "meeting generation failed", error: error.message },
      { status: 500 }
    );
  }
}
