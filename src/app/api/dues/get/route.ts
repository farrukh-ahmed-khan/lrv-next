import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Dues from "@/lib/models/Dues";

export async function GET(req: Request) {
  try {
    await client;

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const due = await Dues.findOne({ userId: decoded.id });

    if (!due) {
      return NextResponse.json({ message: "due not found" }, { status: 404 });
    }

    return NextResponse.json({ due }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user from token:", error);
    return NextResponse.json(
      { message: "Failed to retrieve user", error: error.message },
      { status: 500 }
    );
  }
}
