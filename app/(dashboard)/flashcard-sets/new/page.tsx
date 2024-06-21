"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormConfig } from "@/components/forms/FormConfig";
import { FormSubmit, FormSubmitVaues } from "@/components/forms/FormSubmit";
import { LoadingPage } from "@/components/LoadingPage";
import { AlertCircle, Check } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { FlashcardSet } from "@prisma/client";
import { cn } from "@/lib/utils";

export default function NewFlashcardsPage() {
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

  const { mutate: createSet } = useMutation({
    mutationFn: async ({
      title,
      num,
      description,
      difficulty,
    }: FormSubmitVaues): Promise<FlashcardSet> => {
      const res = await fetch("/api/flashcard-sets", {
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
      queryClient.invalidateQueries({ queryKey: ["sets"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["limit"] });
      setFinished(true);
      setTimeout(() => {
        toast({
          description: (
            <p className="flex items-center">
              <Check className="h-4 w-4 mr-2 " />
              Flashcard set created successfully.
            </p>
          ),
        });
        router.push(`/flashcard-sets/${data.id}`);
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
    createSet(values);
  };

  return (
    <main className="flex-1 flex justify-center items-center w-full relative px-4">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Generate a flashcard set</CardTitle>
          <CardDescription>
            Generate a flashcard set with AI by uploading a file, pasting a
            link, or by defining your own subject.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormConfig
            onContinue={toSubmitPage}
            className={cn(page != "config" && "hidden")}
          />
          <FormSubmit
            isLoading={isLoading}
            itemType="cards"
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
