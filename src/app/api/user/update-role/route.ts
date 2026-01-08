import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import User from "@/lib/models/User";

export async function PUT(req: Request) {
  await client;

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  // Only board members can change roles
  if (!decoded || decoded.role !== "board member") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required." },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { message: "User not found." },
      { status: 404 }
    );
  }

  // 🔁 Toggle role
  user.role = user.role === "board member" ? "home owner" : "board member";

  await user.save();

  return NextResponse.json(
    {
      message: "User role updated successfully.",
      newRole: user.role,
    },
    { status: 200 }
  );
}
