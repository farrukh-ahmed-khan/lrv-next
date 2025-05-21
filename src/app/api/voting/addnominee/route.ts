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

  const { firstname, lastname, role, email, streetAddress, phoneNumber } = await req.json();
  const year = new Date().getFullYear();

  const nominee = await Nominee.create({
    firstname,
    lastname,
    role,
    email,
    streetAddress,
    phoneNumber,
    year,
    addedBy: decoded.id,
  });

  return NextResponse.json(
    { message: "Nominee added", nominee },
    { status: 201 }
  );
}
