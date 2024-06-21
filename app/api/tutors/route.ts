import { getAuthSession } from "@/lib/auth";
import { limitExceeded } from "@/lib/limit-exceeded";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthroized request", status: 401 });

  const { title, description, source } = (await req.json()) as {
    title?: string;
    description?: string;
    source?: string;
  };

  if (!title || !description || !source)
    return NextResponse.json({
      error: "Invalid request, incorrect payload",
      status: 400,
    });

  const isLimitExceeded = await limitExceeded(session);
  if (isLimitExceeded)
    return NextResponse.json({ error: "Limit exceeded", status: 401 });

  const newTutor = await prisma.tutor.create({
    data: {
      title,
      description,
      source,
      userId: session.user.id,
    },
  });

  await prisma.generation.create({
    data: {
      userId: session.user.id,
      type: "tutor",
    },
  });

  return NextResponse.json(newTutor);
}

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthroized request", status: 401 });

  const tutors = await prisma.tutor.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json(tutors);
}
