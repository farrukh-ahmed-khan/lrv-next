import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        await client;

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== "home owner") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const data = await req.json();
        const { firstname, lastname, email, phoneNumber, streetAddress, ownerId } = data;

        if (!firstname || !lastname || !email || !phoneNumber || !streetAddress || !ownerId) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }
        const newMember = new User({
            firstname,
            lastname,
            email,
            phoneNumber,
            streetAddress,
            role: "home member",
            ownerId: ownerId,
        });

        await newMember.save();

        return NextResponse.json({ message: "Member added successfully", member: newMember }, { status: 201 });

    } catch (error: any) {
        console.error("Add Member Error:", error);
        return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
    }
}
