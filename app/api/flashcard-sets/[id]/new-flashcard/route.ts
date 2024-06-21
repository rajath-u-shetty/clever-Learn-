import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();

  const { answer, question } = (await req.json()) as {
    answer?: string;
    question?: string;
  };

  if (!session)
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  if (!answer || !question)
    return NextResponse.json({
      error: "Invalid request, incorrect payload",
      status: 400,
    });

  const updatedFlashcardSet = await prisma.flashcardSet.update({
    where: {
      userId: session.user.id,
      id: params.id,
    },
    data: {
      flashcards: {
        create: {
          answer,
          question,
          userId: session.user.id,
        },
      },
    },
    include: {
      flashcards: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return NextResponse.json(updatedFlashcardSet);
}
