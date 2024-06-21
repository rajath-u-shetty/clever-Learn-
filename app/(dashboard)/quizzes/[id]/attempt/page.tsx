"use client";

import { ExtendedQuiz } from "@/types/prisma";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { useState } from "react";
import { Question } from "@/components/quizzes/Question";
import { Attempt } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

export default function QuizAttempt({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);

  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  function setAnswer(index: number, choice: string) {
    const copy = userAnswers;
    copy[index] = choice;
    setUserAnswers(copy);
  }

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

  const { mutate: submitAttempt, isLoading: isSubmitting } = useMutation({
    mutationFn: async (): Promise<Attempt> => {
      const res = await fetch(`/api/quizzes/${params.id}/attempts`, {
        method: "POST",
        body: JSON.stringify(userAnswers),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["sets", { id: params.id }] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push(`/quizzes/${params.id}/attempt/${data.id}`);
    },
    onError: (data) => {
      console.log(data);
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p>There was an error submitting the attempt. Please try again.</p>
        ),
        variant: "destructive",
      });
    },
  });

  function handleSubmit() {
    console.log(userAnswers.length, quiz?.questions.length);
    console.log(userAnswers);
    if (userAnswers.length != quiz?.questions.length) {
      setOpen(false);
      toast({
        description: (
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Oops, you still have unanswered questions.
          </p>
        ),
        variant: "destructive",
      });
      return;
    }
    userAnswers.forEach((answer) => {
      if (answer == "") {
        setOpen(false);
        toast({
          description: (
            <p className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Oops, you still have unanswered questions.
            </p>
          ),
          variant: "destructive",
        });
        console.log(answer);
        return;
      }
    });
    submitAttempt();
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-16 py-10 md:py-16 mx-auto max-w-4xl px-4">
      {isQuizLoading ? (
        <div className="w-full flex justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        quiz && (
          <>
            <div className="w-full gap-6 flex flex-col">
              <Link href={`/quizzes/${quiz.id}`}>
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex flex-col">
                <h3 className="font-bold text-2xl">{quiz.title}</h3>
                <p className="font-medium text-muted-foreground">
                  {quiz.description}
                </p>
              </div>
              <Separator />
            </div>
            <div className="flex flex-col w-full space-y-24">
              {quiz.questions.map((question, i) => (
                <Question setAnswer={setAnswer} question={question} index={i} />
              ))}
              <AlertDialog open={open} onOpenChange={() => setOpen(!open)}>
                <AlertDialogTrigger asChild>
                  <Button className="w-full">
                    Submit{" "}
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to submit this test?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Make sure you have checked over all your answer choices.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>
                      Submit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )
      )}
    </div>
  );
}
