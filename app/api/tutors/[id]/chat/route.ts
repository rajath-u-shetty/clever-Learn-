import { getAuthSession } from "@/lib/auth";
import { openai } from "@/lib/openai";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionRequestMessage } from "openai-edge";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthenticated request", status: 401 });

  const body = await req.json();
  const messages = body.messages as
    | ChatCompletionRequestMessage[]
    | undefined
    | null;

  if (!messages)
    return NextResponse.json({
      error: "Invalid request, incorrect payload",
      status: 400,
    });

  const targetTutor = await prisma.tutor.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!targetTutor)
    return NextResponse.json({ error: "Invalid request", status: 400 });

  messages.unshift({
    role: "system",
    content: `
      You are a tutoring AI based on this data source: ${targetTutor.source}.
      Respond to the user's questions appropriately based on the data source.
      Refuse to answer any questions unrelated to the data source.
      `,
  });

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    temperature: 1,
    messages: messages,
    stream: true,
  });

  const stream = OpenAIStream(response, {
    onStart: async () => {
      await prisma.message.create({
        data: {
          userId: session.user.id,
          tutorId: params.id,
          content: messages[messages.length - 1].content!,
          role: "user",
        },
      });
    },
    onCompletion: async (completion) => {
      await prisma.message.create({
        data: {
          userId: session.user.id,
          tutorId: params.id,
          content: completion,
          role: "assistant",
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
}
