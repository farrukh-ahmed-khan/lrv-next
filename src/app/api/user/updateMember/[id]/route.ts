import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid member ID" }, { status: 400 });
    }

    const body = await req.json();

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, ownerId: decoded.id },
      {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        phoneNumber: body.phoneNumber,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "Member not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
