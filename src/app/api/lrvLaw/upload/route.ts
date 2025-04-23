import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { verifyToken } from "@/lib/jwt";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import Lrvlaw from "@/lib/models/LrvLaw";

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
        this.push(Buffer.from(value))
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

export async function POST(req: Request) {
  await client;

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || !["admin", "board member"].includes(decoded.role)) {
    return NextResponse.json(
      {
        message: "Forbidden: Only admin or board member can access this route",
      },
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

    const title = Array.isArray(fields.titlename) ? fields.titlename[0] : fields.titlename;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || file.mimetype !== "application/pdf") {
      return NextResponse.json({ message: "Only PDF files allowed." }, { status: 400 });
    }

    const fileContent = fs.readFileSync(file.filepath);
    const currentYear = new Date().getFullYear();
    const s3Key = `lrvlaw/${currentYear}/${Date.now()}_${file.originalFilename}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: s3Key,
        Body: fileContent,
        ContentType: "application/pdf",
      })
    );

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const savedLrvlaw = await Lrvlaw.create({
      title,
      fileUrl,
      uploadedBy: decoded.id,
    });

    return NextResponse.json(
      {
        message: "Lrvlaw uploaded successfully",
        Lrvlaw: savedLrvlaw,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lrvlaw upload error:", error);
    return NextResponse.json({ message: "Upload failed", error: error.message }, { status: 500 });
  }
}
