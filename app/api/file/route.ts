import { getAuthSession } from "@/lib/auth";
import { reduceText } from "@/lib/reduce-text";
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null | undefined;
  const session = await getAuthSession();

  console.log(file);
  console.log(file?.type);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  }

  if (!file) {
    return NextResponse.json({
      error: "Invalid request, no form data",
      status: 400,
    });
  }

  if (file.type == "text/plain") {
    const fileText = await file.text();
    const reduced = reduceText(fileText);
    return NextResponse.json(reduced);
  }

  if (file.type == "application/pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileData = await pdf(fileBuffer);
    const reduced = reduceText(fileData.text);
    return NextResponse.json(reduced);
  }

  if (file.type.includes("audio/") || file.type.includes("video/")) {
    const data = new FormData();
    data.append("file", file);
    data.append("model", "whisper-1");
    data.append("language", "en");
    console.log("is video");
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: "POST",
      body: data,
    });
    const transcription = await res.json();
    console.log(transcription);
    const reduced = reduceText(transcription.text);
    return NextResponse.json(reduced);
  }
}
