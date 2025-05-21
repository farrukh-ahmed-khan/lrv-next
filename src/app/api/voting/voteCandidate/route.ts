import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Vote from "@/lib/models/Vote";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
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

  const allowedRoles = ["home owner", "home member", "board member"];
  if (!allowedRoles.includes(decoded.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { nomineeId } = await req.json();
  const year = new Date().getFullYear();

  const existingVote = await Vote.findOne({ voter: decoded.id, year });
  if (existingVote) {
    return NextResponse.json(
      { message: "You already voted this year" },
      { status: 400 }
    );
  }

  const vote = await Vote.create({
    voter: decoded.id,
    nominee: nomineeId,
    year,
  });

  return NextResponse.json({ message: "Vote recorded", vote }, { status: 201 });
}
