import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // For local development without Vercel Blob token, store as base64 in a data URL
  // In production with BLOB_READ_WRITE_TOKEN, it will use Vercel Blob
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    return NextResponse.json({ url: dataUrl });
  }

  const blob = await put(file.name, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}

