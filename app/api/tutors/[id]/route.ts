import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthroized request", status: 401 });

  const tutor = await prisma.tutor.findUnique({
    where: {
      userId: session.user.id,
      id: params.id,
    },
    include: {
      messages: true,
    },
  });

  return NextResponse.json(tutor);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthroized request", status: 401 });

  const deletedTutor = await prisma.tutor.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  return NextResponse.json(deletedTutor);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthroized request", status: 401 });
  const { title, description } = (await req.json()) as {
    title?: string;
    description?: string;
    source?: string;
  };

  const updatedTutor = await prisma.tutor.update({
    where: {
      userId: session?.user.id,
      id: params.id,
    },
    data: {
      title,
      description,
    },
  });

  return NextResponse.json(updatedTutor);
}
