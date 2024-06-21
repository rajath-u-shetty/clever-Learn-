import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();
  const { searchParams } = new URL(req.url);

  if (session || searchParams.get("secret") == process.env.NEXTAUTH_SECRET) {
    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: {
        id: params.id,
      },
      include: {
        flashcards: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return NextResponse.json(flashcardSet);
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();
  const { title, description } = (await req.json()) as {
    title?: string;
    description?: string;
  };

  if (!session)
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  if (!title || !description)
    return NextResponse.json({
      error: "Inavlid request, incorrect payload",
      status: 401,
    });

  const updatedFlashcardSet = await prisma.flashcardSet.update({
    where: {
      userId: session.user.id,
      id: params.id,
    },
    data: {
      title,
      description,
    },
  });

  return NextResponse.json(updatedFlashcardSet);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();

  if (session) {
    const deletedFlashcardSet = await prisma.flashcardSet.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });
    return NextResponse.json(deletedFlashcardSet);
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  }
}
