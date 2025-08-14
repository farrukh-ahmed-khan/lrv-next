import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Nominee from "@/lib/models/Nominee";

export async function POST(req: Request) {
  await client;

  try {
    const currentYear = new Date().getFullYear();

    // Get nominees sorted by voteCount (you must have a voteCount field)
    const nominees = await Nominee.find({ year: currentYear }).sort({ voteCount: -1 });

    // Group by position
    const grouped = nominees.reduce((acc: any, nominee) => {
      const pos = nominee.position;
      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(nominee);
      return acc;
    }, {});

    // For each position, assign top voted nominee
    for (const pos in grouped) {
      const [winner] = grouped[pos];
      if (winner) {
        await Nominee.updateOne(
          { _id: winner._id },
          { $set: { position: pos } }
        );
      }
    }

    return NextResponse.json({ message: "Positions assigned" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Failed to assign positions" }, { status: 500 });
  }
}
