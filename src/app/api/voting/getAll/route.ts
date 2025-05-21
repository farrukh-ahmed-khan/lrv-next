import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Vote from "@/lib/models/Vote";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  await client;

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (decoded.role !== "board member") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const year = new Date().getFullYear(); 

  const votes = await Vote.find({ year })
    .populate("voter", "firstname lastname role")
    .populate("nominee", "name");

  return NextResponse.json(
    { message: "Votes fetched", votes },
    { status: 200 }
  );
}
