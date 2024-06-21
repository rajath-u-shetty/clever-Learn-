"use client";

import { AttemptsGraph } from "@/components/quizzes/AttemptsGraph";
import { AttemptsTable } from "@/components/quizzes/AttemptsTable";
import { QuizSettings } from "@/components/quizzes/QuizSettings";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { ExtendedQuiz } from "@/types/prisma";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { data: quiz, isLoading: isQuizLoading } = useQuery({
    queryKey: ["quizzes", { id: params.id }],
    queryFn: async (): Promise<ExtendedQuiz> => {
      const res = await fetch(`/api/quizzes/${params.id}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the quiz.</p>,
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
    <div className="flex-1 w-full flex flex-col gap-10 py-10 md:py-16 mx-auto max-w-4xl px-4">
      {isQuizLoading ? (
        <div className="w-full flex justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        quiz && (
          <>
            <div className="w-full gap-6 flex flex-col">
              <div className="flex justify-between items-center w-full gap-4">
                <div className="flex flex-col">
                  <h3 className="font-bold text-2xl">{quiz.title}</h3>
                  <p className="font-medium text-muted-foreground">
                    {quiz.description}
                  </p>
                </div>
                <QuizSettings quiz={quiz} />
              </div>
              <Separator />
            </div>
            <div className="flex flex-col w-full space-y-4">
              <Link href={`/quizzes/${params.id}/attempt`}>
                <Button className="w-full">Attempt Quiz</Button>
              </Link>
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Attempts</CardTitle>
                  <CardDescription>
                    All of your attempts for your {quiz.title} quiz.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttemptsGraph quiz={quiz} />
                  <AttemptsTable quiz={quiz} />
                </CardContent>
              </Card>
            </div>
          </>
        )
      )}
    </div>
  );
}
