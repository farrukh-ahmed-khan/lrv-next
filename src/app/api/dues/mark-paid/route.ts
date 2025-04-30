import { NextResponse } from "next/server";
import { client } from "../../../../lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Dues from "@/lib/models/Dues";

export async function PUT(req: Request) {
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
          message: "Forbidden: Only admin or board member can update due",
        },
        { status: 403 }
      );
    }

    const { transactionId, dueId, autoPay } = await req.json();

    if (!transactionId || !dueId) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const due = await Dues.findByIdAndUpdate(dueId, {
        paid: true,
        transactionId,
        autoPay,
      });

    if (!due) {
      return NextResponse.json(
        { message: "due not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "due updated successfully", due },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during due update:", error);
    return NextResponse.json(
      { message: "due update failed", error: error.message },
      { status: 500 }
    );
  }
}
