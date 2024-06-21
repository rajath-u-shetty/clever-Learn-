import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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

  const updatedItem = await prisma.flashcard.update({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: {
      answer,
      question,
    },
  });

  return NextResponse.json(updatedItem);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthorized request", status: 401 });

  const deletedSetItem = await prisma.flashcard.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  return NextResponse.json(deletedSetItem);
}
