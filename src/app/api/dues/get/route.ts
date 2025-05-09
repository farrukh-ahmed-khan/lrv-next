import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Dues from "@/lib/models/Dues";
import User from "@/lib/models/User"; // Import User model

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

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let targetUserId = currentUser._id;

    if (currentUser.role === "home member") {
      const homeOwner = await User.findOne({
        streetAddress: currentUser.streetAddress,
        role: "home owner",
        status: "approved", 
      });

      if (!homeOwner) {
        return NextResponse.json({ due: [] }, { status: 200 });
      }

      targetUserId = homeOwner._id;
    }

    const due = await Dues.find({
      userId: targetUserId,
    }).sort({ dueDate: 1 });

    return NextResponse.json({ due }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching dues:", error);
    return NextResponse.json(
      { message: "Failed to retrieve dues", error: error.message },
      { status: 500 }
    );
  }
}
