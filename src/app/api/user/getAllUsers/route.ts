import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    await client;

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || !["home owner", "home member", "board member", "admin"].includes(decoded.role)) {
      return NextResponse.json(
        {
          message:
            "Forbidden: Only admin or board member can access this route",
        },
        { status: 403 }
      );
    }

    const users = await User.find(
      { 
        // role: { $nin: ["admin", "board member"] }, 
        password: { $exists: true, $ne: null }
      },
      "-password"
    );

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to retrieve users", error: error.message },
      { status: 500 }
    );
  }
}
