import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";
import UpcomingEvent from "@/lib/models/UpcomingEvent";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

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

/* 🔁 Convert Next Request → Node Request */
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

/* ☁️ S3 Client */
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await client;
    const { id } = await context.params;

    /* 🔐 Auth */
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "board member") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    /* 🧪 Validate Event ID */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    const event = await UpcomingEvent.findById(id);
    if (!event) {
      return NextResponse.json(
        { message: "Upcoming event not found" },
        { status: 404 }
      );
    }

    /* 📦 Parse multipart form */
    const form = new IncomingForm({ keepExtensions: true, multiples: false });
    const nodeReq = await toNodeRequest(req);

    const { fields, files }: { fields: Fields; files: Files } =
      await new Promise((resolve, reject) => {
        form.parse(nodeReq, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

    /* ✅ Extract fields */
    const eventname = Array.isArray(fields.eventname)
      ? fields.eventname[0]
      : fields.eventname;

    const date = Array.isArray(fields.date) ? fields.date[0] : fields.date;

    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;

    /* 🖼 Optional image update */
    let imageUrl = event.image;

    if (files.image) {
      const image = Array.isArray(files.image) ? files.image[0] : files.image;

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

      imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    }

    /* 🗄 Update Event */
    event.eventname = eventname ?? event.eventname;
    event.date = date ?? event.date;
    event.description = description ?? event.description;
    event.image = imageUrl;

    await event.save();

    return NextResponse.json(
      {
        message: "Upcoming event updated successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating upcoming event:", error);
    return NextResponse.json(
      { message: "Failed to update upcoming event", error: error.message },
      { status: 500 }
    );
  }
}
