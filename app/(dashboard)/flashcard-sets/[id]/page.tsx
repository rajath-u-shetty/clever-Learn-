"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedFlashcardSet } from "@/types/prisma";
import { useQuery } from "react-query";
import { FlashcardCarousel } from "@/components/flashcards/FlashcardCarousel";
import { SetCard } from "@/components/flashcards/SetCard";
import { useRouter } from "next/navigation";
import { CopyPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { NewFlashcard } from "@/components/flashcards/NewFlashcard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SetSettings } from "@/components/flashcards/SetSettings";
import { Separator } from "@/components/ui/separator";

export default function FlashcardSetPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const { data: set, isLoading: isSetLoading } = useQuery({
    queryKey: ["sets", { id: params.id }],
    queryFn: async (): Promise<ExtendedFlashcardSet> => {
      const res = await fetch(`/api/flashcard-sets/${params.id}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the flashcard set.</p>,
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
      <div className="w-full gap-6 flex flex-col">
        {isSetLoading ? (
          <div className="flex flex-col w-full space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : (
          set && (
            <>
              <div className="flex justify-between items-center w-full gap-6">
                <div className="flex flex-col">
                  <h3 className="font-bold text-2xl">{set.title}</h3>
                  <p className="font-medium text-muted-foreground">
                    {set.description}
                  </p>
                </div>
                <SetSettings set={set} />
              </div>
              <Separator />
            </>
          )
        )}
      </div>
      {isSetLoading ? (
        <Skeleton className="h-[450px] w-full" />
      ) : (
        set && (
          <div className="space-y-32 md:space-y-16">
            <FlashcardCarousel set={set} />
            <div className="space-y-4">
              <div className="flex gap-2 items-center justify-between">
                <p className="font-semibold text-lg">Set Items</p>
                <Dialog>
                  <DialogTrigger>
                    <Button size="sm">
                      New Flashcard <CopyPlus className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <NewFlashcard set={set} />
                </Dialog>
              </div>
              <div className="space-y-8">
                {set.flashcards.map((flashcard) => (
                  <SetCard set={set} key={flashcard.id} flashcard={flashcard} />
                ))}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      Add a new flashcard to the set{" "}
                      <CopyPlus className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <NewFlashcard set={set} />
                </Dialog>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
