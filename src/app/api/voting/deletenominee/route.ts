import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Nominee from "@/lib/models/Nominee";
import Vote from "@/lib/models/Vote";
import User from "@/lib/models/User";

export async function DELETE(req: Request) {
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

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { message: "Nominee ID is required" },
      { status: 400 }
    );
  }

  const nominee = await Nominee.findById(id);
  if (!nominee) {
    return NextResponse.json({ message: "Nominee not found" }, { status: 404 });
  }

  await Vote.deleteMany({ nominee: nominee._id });

  if (nominee.email) {
    await User.findOneAndUpdate(
      { email: nominee.email },
      { position: null }
    );
  }

  // 🔹 Delete the nominee itself
  await Nominee.findByIdAndDelete(id);

  return NextResponse.json(
    { message: "Nominee and related votes deleted, user position reset." },
    { status: 200 }
  );
}
