import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";


export async function PUT(req: Request) {
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
  
      const body = await req.json();
      const id = body.id;
  
      const updatedUser = await User.findOneAndUpdate(
        { _id: decoded.id },
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
  