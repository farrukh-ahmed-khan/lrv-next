import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Library from "@/lib/models/Library";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await client;

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "board member") {
      return NextResponse.json(
        { message: "Forbidden: board member only" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { libraryname } = body;

    if (!libraryname) {
      return NextResponse.json(
        { message: "Library name is required" },
        { status: 400 }
      );
    }

    const newLibrary = await Library.create({
      libraryname,
      userId: decoded.id
     });

    return NextResponse.json({
      message: "Library added successfully",
      library: newLibrary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add Library", error: error.message },
      { status: 500 }
    );
  }
}
