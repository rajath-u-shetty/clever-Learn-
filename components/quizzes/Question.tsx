import { Question } from "@prisma/client";
import { Card } from "../ui/card";
import { getLetter } from "@/lib/get-letter";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Question({
  question,
  setAnswer,
  index,
}: {
  question: Question;
  setAnswer(index: number, choice: string, i: number): void;
  index: number;
}) {
  function handleAnswer(choice: string, i: number) {
    setAnswer(index, choice, i);
    setCurrChoice(i);
  }

  const [currChoice, setCurrChoice] = useState<number>();

  return (
    <div className="flex flex-col space-y-4">
      <Card className="p-6 bg-background">
        <p className="font-semibold">
          {" "}
          {index + 1}. {question.question}
        </p>
      </Card>
      <div className="flex flex-col space-y-1">
        {question.possibleAnswers.map((choice, i) => (
          <Button
            onClick={() => handleAnswer(choice, i)}
            variant="outline"
            className={cn(
              "justify-start space-x-4 h-16",
              currChoice == i && "bg-accent",
            )}
          >
            <p>{getLetter(i)}.</p>
            <p className="text-sm font-medium text-start">{choice}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}
