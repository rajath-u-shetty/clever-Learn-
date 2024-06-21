"use client";

import { AttemptQuestion } from "@/components/quizzes/AttemptQuestion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { ExtendedAttempt } from "@/types/prisma";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";

export default function AttemptResults({
  params,
}: {
  params: { id: string; attemptId: string };
}) {
  const router = useRouter();

  const { data: attempt, isLoading } = useQuery({
    queryFn: async (): Promise<ExtendedAttempt> => {
      const res = await fetch(
        `/api/quizzes/${params.id}/attempts?attemptId=${params.attemptId}`,
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the quiz attempt.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  return (
    <div className="flex-1 w-full flex flex-col gap-16 py-10 md:py-16 mx-auto max-w-4xl px-4">
      {isLoading ? (
        <div className="w-full flex justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        attempt && (
          <>
            <div className="w-full gap-6 flex flex-col">
              <Link href={`/quizzes/${attempt.quizId}`}>
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex flex-col">
                <h3 className="font-bold text-2xl">{attempt.quiz.title}</h3>
                <p className="font-medium text-muted-foreground">
                  {attempt.quiz.description}
                </p>
              </div>
              <Separator />
              <div className="flex items-center space-x-4 font-medium text-lg text-muted-foreground">
                <p className="text-foreground">Result:</p>
                <p>{Number(attempt.score) * 100}%</p>
                <p>
                  {Number(attempt.score) * attempt.quiz.questions.length}/
                  {attempt.quiz.questions.length}
                </p>
              </div>
            </div>
            <div className="flex flex-col w-full space-y-24">
              {attempt.quiz.questions.map((question, i) => (
                <AttemptQuestion
                  question={question}
                  userAnswer={attempt.userAnswers[i]}
                  index={i}
                />
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}
