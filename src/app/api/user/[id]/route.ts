// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await client;
    console.log("checking");
    const { id } = await context.params;

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Only admin or board member can edit
    if (!decoded || !["admin", "board member"].includes(decoded.role)) {
      return NextResponse.json(
        { message: "Forbidden: Only admin or board member can edit users" },
        { status: 403 }
      );
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const body = await req.json();
    const { firstname, lastname, email, phoneNumber } = body;

    // Only update allowed fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstname, lastname, email, phoneNumber },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}
