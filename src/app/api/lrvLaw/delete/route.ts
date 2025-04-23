import { client } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import Lrvlaw from "@/lib/models/LrvLaw";

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
      { message: "lrvlaw ID is required" },
      { status: 400 }
    );

  try {
    const lrvlaw = await Lrvlaw.findByIdAndDelete(id);
    if (!lrvlaw)
      return NextResponse.json(
        { message: "lrvlaw not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "lrvlaw deleted successfully" },
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
