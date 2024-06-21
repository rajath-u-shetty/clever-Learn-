import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized request", staus: 401 });

  const { searchParams } = new URL(req.nextUrl);
  const attemptId = searchParams.get("attemptId");

  if (!attemptId)
    return NextResponse.json({
      error: "Invalid request, no attempt id",
      staus: 400,
    });

  const attempt = await prisma.attempt.findUnique({
    where: {
      userId: session.user.id,
      id: attemptId,
      quizId: params.id,
    },
    include: {
      quiz: {
        include: {
          questions: true,
        },
      },
    },
  });

  return NextResponse.json(attempt);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized request", status: 401 });

  const userAnswers = (await req.json()) as string[] | null | undefined;
  if (!userAnswers)
    return NextResponse.json({
      error: "Invalid request, incorrect payload",
      status: 400,
    });

  const targetQuiz = await prisma.quiz.findUnique({
    where: {
      userId: session.user.id,
      id: params.id,
    },
    include: {
      questions: true,
    },
  });

  if (!targetQuiz)
    return NextResponse.json({
      error: "Invalid request, incorrect payload",
      status: 400,
    });

  const quizQuestions = targetQuiz.questions;

  let correct = quizQuestions.length;

  quizQuestions.forEach((question, i) => {
    if (question.correctAnswer != userAnswers[i]) {
      correct--;
    }
  });

  const score = correct / quizQuestions.length;

  const newAttempt = await prisma.attempt.create({
    data: {
      userId: session.user.id,
      quizId: targetQuiz.id,
      score,
      userAnswers,
    },
  });

  return NextResponse.json(newAttempt);
}
