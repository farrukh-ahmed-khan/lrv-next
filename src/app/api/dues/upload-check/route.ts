import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { verifyToken } from "@/lib/jwt";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { client } from "@/lib/mongodb";
import Dues from "@/lib/models/Dues";

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
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || !["home owner", "home member"].includes(decoded.role)) {
    return NextResponse.json(
      { message: "Forbidden: Only homeowners or members can upload check" },
      { status: 403 }
    );
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

    const dueId = Array.isArray(fields.dueId) ? fields.dueId[0] : fields.dueId;
    const file = Array.isArray(files.checkImage) ? files.checkImage[0] : files.checkImage;

    if (!file) {
      return NextResponse.json({ message: "No file provided." }, { status: 400 });
    }

    const mimetype = file.mimetype?.toLowerCase() || "";
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/pjpeg"];

    // Extension fallback
    const ext = file.originalFilename?.split(".").pop()?.toLowerCase();
    const allowedExts = ["jpg", "jpeg", "png"];

    if (!allowedTypes.includes(mimetype) && (!ext || !allowedExts.includes(ext))) {
      return NextResponse.json({ message: "Only JPG/PNG images are allowed." }, { status: 400 });
    }

    const fileContent = fs.readFileSync(file.filepath);
    const fileKey = `bank-checks/${decoded.id}/${Date.now()}_${file.originalFilename}`;
    const bucket = process.env.AWS_S3_BUCKET!;
    const region = process.env.AWS_REGION!;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: fileContent,
        ContentType: mimetype || "application/octet-stream",
      })
    );

    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`;

    // ✅ Update Dues with checkImage and set paidStatus to "Pending"
    const due = await Dues.findByIdAndUpdate(
      dueId,
      {
        checkImage: fileUrl,
        paidStatus: "Pending",
        paymentMethod: "Check",
      },
      { new: true }
    );

    if (!due) {
      return NextResponse.json({ message: "Due not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Check uploaded successfully", fileUrl, due },
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
