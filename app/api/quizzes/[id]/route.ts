import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized Request", status: 401 });

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      questions: true,
      attempts: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return NextResponse.json(quiz);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized Request", status: 401 });

  const deletedQuiz = await prisma.quiz.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  return NextResponse.json(deletedQuiz);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized Request", status: 401 });

  const { title, description } = (await req.json()) as {
    title?: string;
    description?: string;
  };
  if (!title || !description)
    return NextResponse.json({
      error: "Invalid request, incorrect payload",
      status: 400,
    });

  const updatedQuiz = await prisma.quiz.update({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: {
      title,
      description,
    },
  });

  return NextResponse.json(updatedQuiz);
}
