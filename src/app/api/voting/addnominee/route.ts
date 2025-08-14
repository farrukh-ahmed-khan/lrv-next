import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Nominee from "@/lib/models/Nominee";

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

  if (decoded.role !== "board member") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const {
    firstname,
    lastname,
    role,
    email,
    streetAddress,
    phoneNumber,
    position,
  } = await req.json();
  const year = new Date().getFullYear();

  if (!position) {
    return NextResponse.json(
      { message: "Position is required" },
      { status: 400 }
    );
  }

  const existingNominee = await Nominee.findOne({ email, year, position }); // ✅ ensure unique per position/year
  if (existingNominee) {
    return NextResponse.json(
      {
        message: "This user is already a nominee for this position this year.",
      },
      { status: 400 }
    );
  }

  const nominee = await Nominee.create({
    firstname,
    lastname,
    role,
    email,
    streetAddress,
    phoneNumber,
    position, // ✅
    year,
    addedBy: decoded.id,
  });

  return NextResponse.json(
    { message: "Nominee added", nominee },
    { status: 201 }
  );
}
