import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthenticated request", status: 401 });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      quizAttempts: {
        include: {
          quiz: true,
        },
        take: 3,
      },
      flashcardSets: {
        take: 3,
      },
      tutors: {
        take: 3,
      },
      generations: true,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthenticated request", status: 401 });

  const payload = (await req.json()) as {
    name?: string;
    email?: string;
    image?: string;
  };

  if (!payload.name || !payload.email || !payload.image)
    return NextResponse.json({
      error: "Invalid request, incorrect payload",
      status: 400,
    });

  const updatedUser = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: payload,
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(req: NextRequest) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthenticated request", status: 401 });

  const deletedUser = await prisma.user.delete({
    where: {
      id: session.user.id,
    },
  });

  return NextResponse.json(deletedUser);
}
