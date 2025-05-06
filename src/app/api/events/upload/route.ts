// /app/api/events/upload/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import Event from "@/lib/models/Events";
import { verifyToken } from "@/lib/jwt";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function toNodeRequest(req: Request): Promise<IncomingMessage> {
  const body = req.body;
  if (!body) throw new Error("Request body is missing");

  const reader = body.getReader();
  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      this.push(done ? null : Buffer.from(value));
    },
  });

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => (headers[key.toLowerCase()] = value));

  return Object.assign(stream, {
    headers,
    method: req.method,
    url: req.url || "",
  }) as IncomingMessage;
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
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

  const form = new IncomingForm({ keepExtensions: true, multiples: true });

  const parseForm = async (): Promise<{ fields: Fields; files: Files }> => {
    const nodeReq = await toNodeRequest(req);
    return new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
  };

  try {
    const { fields, files } = await parseForm();

    const eventId = Array.isArray(fields.eventId)
      ? fields.eventId[0]
      : fields.eventId;

    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const uploadedUrls: string[] = [];
    // const images = Array.isArray(files.images) ? files.images : [files.images];

    // for (const image of images) {
    //   if (
    //     !image ||
    //     !image.filepath ||
    //     !image.originalFilename ||
    //     !image.mimetype
    //   ) {
    //     continue;
    //   }

    //   const fileContent = fs.readFileSync(image.filepath);
    //   const s3Key = `events/${eventId}/${Date.now()}_${image.originalFilename}`;

    //   await s3.send(
    //     new PutObjectCommand({
    //       Bucket: process.env.AWS_S3_BUCKET!,
    //       Key: s3Key,
    //       Body: fileContent,
    //       ContentType: image.mimetype,
    //     })
    //   );

    //   const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    //   uploadedUrls.push(imageUrl);
    // }

    
    const rawImage = files.image;

    const images = Array.isArray(rawImage) ? rawImage : [rawImage];

    for (const image of images) {
      if (
        !image ||
        !image.filepath ||
        !image.originalFilename ||
        !image.mimetype
      ) {
        continue;
      }

      const fileContent = fs.readFileSync(image.filepath);
      const s3Key = `events/${eventId}/${Date.now()}_${image.originalFilename}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: s3Key,
          Body: fileContent,
          ContentType: image.mimetype,
        })
      );

      const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
      uploadedUrls.push(imageUrl);
    }

    event.images.push(...uploadedUrls);
    await event.save();

    return NextResponse.json(
      { message: "Images uploaded", event },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}
