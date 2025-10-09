import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Library from "@/lib/models/Library";
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

  const { libraryId, imageUrl } = await req.json(); // libraryId and imageUrl should be passed in the body

  if (!libraryId || !imageUrl) {
    return NextResponse.json({ message: "Library ID and Image URL are required" }, { status: 400 });
  }

  try {
    const library = await Library.findById(libraryId);
    if (!library) {
      return NextResponse.json({ message: "Library not found" }, { status: 404 });
    }

    const imageIndex = library.images.indexOf(imageUrl);
    if (imageIndex === -1) {
      return NextResponse.json({ message: "Image not found in library" }, { status: 404 });
    }

    library.images.splice(imageIndex, 1);
    await library.save();

    const s3Key = imageUrl.split(`${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`)[1];
    
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: s3Key,
      })
    );

    return NextResponse.json({ message: "Image deleted successfully", library }, { status: 200 });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ message: "Delete failed", error: error.message }, { status: 500 });
  }
}
