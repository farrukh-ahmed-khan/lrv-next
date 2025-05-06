import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Event from "@/lib/models/Events";
import { verifyToken } from "@/lib/jwt";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(req: Request) {
  await client;

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  const { eventId, imageUrl } = await req.json(); // eventId and imageUrl should be passed in the body

  if (!eventId || !imageUrl) {
    return NextResponse.json({ message: "Event ID and Image URL are required" }, { status: 400 });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const imageIndex = event.images.indexOf(imageUrl);
    if (imageIndex === -1) {
      return NextResponse.json({ message: "Image not found in event" }, { status: 404 });
    }

    event.images.splice(imageIndex, 1);
    await event.save();

    const s3Key = imageUrl.split(`${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`)[1];
    
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: s3Key,
      })
    );

    return NextResponse.json({ message: "Image deleted successfully", event }, { status: 200 });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ message: "Delete failed", error: error.message }, { status: 500 });
  }
}
