import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
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

    if (!decoded || decoded.role !== "board member") {
      return NextResponse.json(
        { message: "Forbidden: Only board members can perform this action" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const dueId = url.pathname.split("/")[4]; 

    const body = await req.json();
    const { paidStatus } = body;

    if (!["Unpaid", "Pending", "Paid"].includes(paidStatus)) {
      return NextResponse.json(
        { message: "Invalid paidStatus value" },
        { status: 400 }
      );
    }

    const updates: any = {
      paidStatus,
      paid: paidStatus === "Paid",
    };

    const updatedDue = await Dues.findByIdAndUpdate(dueId, updates, {
      new: true,
    });

    if (!updatedDue) {
      return NextResponse.json({ message: "Due not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Due payment status updated", due: updatedDue },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating due paid status:", error);
    return NextResponse.json(
      { message: "Failed to update due", error: error.message },
      { status: 500 }
    );
  }
}
