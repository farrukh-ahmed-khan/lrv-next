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

    if (!decoded || !["home owner"].includes(decoded.role)) {
      return NextResponse.json(
        {
          message: "Forbidden: Only home owner can access this route",
        },
        { status: 403 }
      );
    }
    console.log(decoded.id)

    const users = await User.find(
      {
        role: "home member",
        ownerId: decoded.id,
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
