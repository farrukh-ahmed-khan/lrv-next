import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import UpcomingEvent from "@/lib/models/UpcomingEvent";
import { verifyToken } from "@/lib/jwt";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { Readable } from "stream";
import { IncomingMessage } from "http";

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
  try {
    await client;

    // 🔒 Auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "board member") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 📦 Parse multipart form
    const form = new IncomingForm({ keepExtensions: true, multiples: false });
    const nodeReq = await toNodeRequest(req);

    const { fields, files }: { fields: Fields; files: Files } =
      await new Promise((resolve, reject) => {
        form.parse(nodeReq, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

    // ✅ Match frontend naming
    const eventname = Array.isArray(fields.eventname)
      ? fields.eventname[0]
      : fields.eventname;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;
    const date = Array.isArray(fields.date) ? fields.date[0] : fields.date;

    const imageFile = files.image;
    if (!eventname || !date || !imageFile) {
      return NextResponse.json(
        { message: "Event name, date, and image are required" },
        { status: 400 }
      );
    }

    // 🖼 Upload image to S3
    const image = Array.isArray(imageFile) ? imageFile[0] : imageFile;
    const fileContent = fs.readFileSync(image.filepath);

    const originalFilename =
      image.originalFilename ?? `event_${Date.now()}.jpg`;
    const mimeType = image.mimetype || "application/octet-stream";

    const s3Key = `upcoming-events/${Date.now()}_${originalFilename}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: s3Key,
        Body: fileContent,
        ContentType: mimeType,
      })
    );

    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // 🗄 Save event
    const newEvent = await UpcomingEvent.create({
      userId: decoded.id,
      eventname, // fixed naming
      description,
      date,
      image: imageUrl,
    });

    return NextResponse.json(
      { message: "Upcoming event added successfully", event: newEvent },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating upcoming event:", error);
    return NextResponse.json(
      { message: "Failed to add upcoming event", error: error.message },
      { status: 500 }
    );
  }
}
