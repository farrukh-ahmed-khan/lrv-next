import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Nominee from "@/lib/models/Nominee";
import Vote from "@/lib/models/Vote";

export async function GET(req: Request) {
  await client;

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || decoded.role !== "board member") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const year = new Date().getFullYear();

  const nominees = await Nominee.find({ year });

  const voteSummary = await Promise.all(
    nominees.map(async (nominee) => {
      const voteCount = await Vote.countDocuments({
        nominee: nominee._id,
        year,
      });

      return {
        id: nominee._id,
        firstname: nominee.firstname,
        lastname: nominee.lastname,
        email: nominee.email,
        role: nominee.role,
        position: nominee.position,
        voteCount,
      };
    })
  );

  return NextResponse.json({ nominees: voteSummary });
}
