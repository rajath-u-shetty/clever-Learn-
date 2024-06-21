import { getAuthSession } from "@/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthorized Request", status: 401 });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (user?.unlimited) return NextResponse.json(false);

  const now = new Date();
  const beg = new Date(now.getFullYear(), now.getMonth(), 1);

  let nextmonth;
  if (now.getMonth() == 12) {
    nextmonth = 1;
  } else {
    nextmonth = now.getMonth() + 1;
  }
  const end = new Date(now.getFullYear(), nextmonth, 1);

  const generationCount = await prisma.generation.count({
    where: {
      userId: session.user.id,
      date: {
        gte: beg,
        lt: end,
      },
    },
  });

  if (generationCount >= Number(process.env.GENERATION_LIMIT))
    return NextResponse.json(true);

  return NextResponse.json(false);
}
