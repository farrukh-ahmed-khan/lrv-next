import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Dues from "@/lib/models/Dues";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request, { params }: { params: { id: string } }) {
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

    const due = await Dues.findOne({
      _id: params.id,
      userId: decoded.id, 
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
