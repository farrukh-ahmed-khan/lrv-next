import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Dues from "@/lib/models/Dues";

export async function GET() {
  try {
    await client;

    const approvedUsers = await User.find({ status: "approved" });

    for (const user of approvedUsers) {
      const existingDue = await Dues.findOne({
        userId: user._id,
        streetAddress: user.streetAddress,
        dueDate: { $gt: new Date() },
      });

      if (!existingDue) {
        const dueDate = new Date();
        // dueDate.setFullYear(dueDate.getFullYear() + 1);
        dueDate.setHours(dueDate.getHours() + 6);
        
        await Dues.create({
          userId: user._id,
          streetAddress: user.streetAddress,
          amount: 300,
          dueDate,
          paymentMethod: null,
          autoPay: false,
        });
      }
    }

    return NextResponse.json({ message: "Dues updated successfully" });
  } catch (error: any) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { message: "Error in cron job", error: error.message },
      { status: 500 }
    );
  }
}
