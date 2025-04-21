import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "@/lib/mongodb";
import Newsletter from "@/lib/models/Newsletter";
import { NextResponse } from "next/server";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { verifyToken } from "@/lib/jwt";
import { Readable } from "stream";
import { IncomingMessage } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function toNodeRequest(req: Request): Promise<IncomingMessage> {
  const body = req.body;
  if (!body) {
    throw new Error("Request body is missing");
  }

  const reader = body.getReader();
  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    },
  });

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const nodeReq = Object.assign(stream, {
    headers,
    method: req.method,
    url: req.url || "",
  });

  return nodeReq as IncomingMessage;
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function PUT(req: Request) {
  await client;

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || !["admin", "board member"].includes(decoded.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const form = new IncomingForm({ keepExtensions: true });

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

    const { id, titlename } = fields;
    if (!id) {
      return NextResponse.json({ message: "Newsletter ID is required" }, { status: 400 });
    }

    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
      return NextResponse.json({ message: "Newsletter not found" }, { status: 404 });
    }

    newsletter.title = Array.isArray(titlename) ? titlename[0] : titlename;

    if (files.file) {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (file.mimetype !== "application/pdf") {
        return NextResponse.json({ message: "Only PDF files allowed." }, { status: 400 });
      }

      const fileContent = fs.readFileSync(file.filepath);
      const currentYear = new Date().getFullYear();
      const s3Key = `newsletters/${currentYear}/${Date.now()}_${file.originalFilename}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: s3Key,
          Body: fileContent,
          ContentType: "application/pdf",
        })
      );

      const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
      newsletter.fileUrl = fileUrl;
      newsletter.year = currentYear;
    }

    await newsletter.save();

    return NextResponse.json(
      { message: "Newsletter updated successfully", newsletter },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
  }
}
