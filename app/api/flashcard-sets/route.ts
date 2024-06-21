import { FlashcardGeneration, schema } from "@/config/schemas/flashcard-set";
import { getAuthSession } from "@/lib/auth";
import { limitExceeded } from "@/lib/limit-exceeded";
import { openai } from "@/lib/openai";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ResponseTypes } from "openai-edge";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (session) {
    const flashcardSets = await prisma.flashcardSet.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        flashcards: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return NextResponse.json(flashcardSets);
  } else {
    return NextResponse.json({ error: "Unauthorized request", status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized Request", status: 401 });

  const isLimitExceeded = await limitExceeded(session);
  if (isLimitExceeded)
    return NextResponse.json({ error: "Limit exceeded", status: 401 });

  const { source, num, title, description, difficulty } =
    (await req.json()) as {
      source?: string;
      num?: number;
      title?: string;
      description?: string;
      difficulty?: "easy" | "medium" | "hard";
    };

  if (
    !source ||
    !num ||
    Number(process.env.MAX_NUM) > 20 ||
    !title ||
    !description ||
    !difficulty
  )
    return NextResponse.json({
      error: "Invalid request, incorrect paylod",
      status: 400,
    });

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "system",
        content: `You area a flashcard set generation AI. when given a source, create a flashcard set of only ${num} cards of ${difficulty} difficulty based on that source. If the source has insufficient data, use your own information and training data to create the flashcards.`,
      },
      {
        role: "user",
        content: source,
      },
    ],
    functions: [
      {
        name: "flashcard_set",
        parameters: schema,
      },
    ],
    function_call: {
      name: "flashcard_set",
    },
    temperature: 1,
  });

  const data = (await response.json()) as ResponseTypes["createChatCompletion"];
  const json = JSON.parse(
    data.choices[0].message?.function_call?.arguments!,
  ) as FlashcardGeneration;
  console.log(json);
  const generatedSet = json.flashcards.map((flashcard) => {
    return {
      userId: session.user.id,
      answer: flashcard.answer,
      question: flashcard.question,
    };
  });

  const newFlashcardSet = await prisma.flashcardSet.create({
    data: {
      title,
      description,
      userId: session.user.id,
      flashcards: {
        createMany: {
          data: generatedSet,
        },
      },
    },
  });

  await prisma.generation.create({
    data: {
      userId: session.user.id,
      type: "flashcard-set",
    },
  });

  return NextResponse.json(newFlashcardSet);
}
