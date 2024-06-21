"use client";

import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Volume2 } from "lucide-react";
import { Flashcard } from "@prisma/client";
import { Button } from "../ui/button";
import { CardMore } from "./CardMore";
import { useSession } from "next-auth/react";
import { ExtendedFlashcardSet } from "@/types/prisma";

export function FlashcardDisplay({
  flashcard,
  index,
  set,
}: {
  flashcard: Flashcard;
  index: number;
  set: ExtendedFlashcardSet;
}) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const synth = window.speechSynthesis;

  useEffect(() => {
    setIsFlipped(false);
  }, [index]);

  function readContent() {
    const utterThis = new SpeechSynthesisUtterance(
      isFlipped ? flashcard.answer : flashcard.question,
    );
    synth.speak(utterThis);
  }

  const { data: session } = useSession();

  return (
    <div className="relative">
      <ReactCardFlip isFlipped={isFlipped} flipDirection={"horizontal"}>
        <Card className="relative flex justify-center items-center flex-1 w-full p-12 h-[450px] overflow-y-auto shadow-sm bg-card">
          <div className="flex flex-col items-center text-center space-y-1">
            <p className="font-medium text-muted-foreground">Question:</p>
            <p className="font-bold text-3xl ">{flashcard.question}</p>
          </div>
          <button
            className="cursor-pointer absolute inset-0"
            onClick={() => setIsFlipped(!isFlipped)}
          />
          <div className="fixed top-0 right-0 m-4 flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={readContent}>
              <Volume2 className="h-4 w-4" />
            </Button>
            {session?.user.id == flashcard.userId && (
              <CardMore flashcard={flashcard} set={set} />
            )}
          </div>
        </Card>
        <Card className="relative flex justify-center items-center flex-1 w-full p-12 h-[450px] overflow-y-auto shadow-sm">
          <div className="flex flex-col items-center text-center space-y-1">
            <p className="font-medium text-muted-foreground">Answer:</p>
            <p className="font-bold text-3xl ">{flashcard.answer}</p>
          </div>
          <button
            className="cursor-pointer absolute inset-0"
            onClick={() => setIsFlipped(!isFlipped)}
          />
          <div className="fixed top-0 right-0 m-4 flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={readContent}>
              <Volume2 className="h-4 w-4" />
            </Button>
            {session?.user.id == flashcard.userId && (
              <CardMore set={set} flashcard={flashcard} />
            )}
          </div>
        </Card>
      </ReactCardFlip>
    </div>
  );
}
