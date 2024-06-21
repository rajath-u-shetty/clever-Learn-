"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FormConfig } from "@/components/forms/FormConfig";
import { FormSubmit, FormSubmitVaues } from "@/components/forms/FormSubmit";
import { Quiz } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { LoadingPage } from "@/components/LoadingPage";
import { cn } from "@/lib/utils";

export default function NewQuizPage() {
  const [page, setPage] = useState<"config" | "submit">("config");
  const [source, setSource] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function toSubmitPage(text: string) {
    setSource(text);
    setPage("submit");
  }

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: exceedsLimit } = useQuery({
    queryKey: ["limit"],
    queryFn: async (): Promise<boolean> => {
      const res = await fetch("/api/limit");
      const data = await res.json();
      return data;
    },
  });

  const { mutate: createQuiz } = useMutation({
    mutationFn: async ({
      title,
      description,
      num,
      difficulty,
    }: FormSubmitVaues): Promise<Quiz> => {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        body: JSON.stringify({
          title,
          num,
          description,
          source,
          difficulty,
        }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["limit"] });
      setFinished(true);
      setTimeout(() => {
        toast({
          description: (
            <p className="flex items-center">
              <Check className="h-4 w-4 mr-2 " />
              Quiz created successfully.
            </p>
          ),
        });
        router.push(`/quizzes/${data.id}/attempt`);
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Oops, there was an error creating a new flashcard set. Please try
            again.
          </p>
        ),
        variant: "destructive",
      });
    },
  });

  const submitForm = (values: FormSubmitVaues) => {
    if (exceedsLimit || exceedsLimit == undefined) {
      toast({
        title: "Uh oh something went wrong!",
        description: "Oops, you have exceeded your limit.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    createQuiz(values);
  };

  return (
    <main className="flex-1 flex justify-center items-center relative px-4">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Generate a quiz</CardTitle>
          <CardDescription>
            Generate a quiz with AI by uploading a file, pasting a link, or by
            defining your own subject.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormConfig
            onContinue={toSubmitPage}
            className={cn(page != "config" && "hidden")}
          />
          <FormSubmit
            isLoading={isLoading}
            itemType="questions"
            onSubmit={submitForm}
            onBack={() => setPage("config")}
            className={cn(page != "submit" && "hidden")}
          />
        </CardContent>
      </Card>
      <AnimatePresence>
        {isLoading && <LoadingPage finished={finished} />}
      </AnimatePresence>
    </main>
  );
}
