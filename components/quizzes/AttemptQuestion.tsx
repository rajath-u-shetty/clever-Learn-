import { getLetter } from "@/lib/get-letter";
import { Question } from "@prisma/client";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

export function AttemptQuestion({
  question,
  userAnswer,
  index,
}: {
  question: Question;
  userAnswer: string;
  index: number;
}) {
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
            variant="outline"
            className={cn(
              "justify-start space-x-4 h-16 hover:bg-background cursor-auto",
              choice == question.correctAnswer &&
                "bg-green-500 hover:bg-green-500 !text-white",
              choice == userAnswer &&
                choice != question.correctAnswer &&
                "bg-red-500 hover:bg-red-500 !text-white",
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
