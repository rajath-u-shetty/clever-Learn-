"use client";

import { useState } from "react";
import { FlashcardDisplay } from "./FlashcardDisplay";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ExtendedFlashcardSet } from "@/types/prisma";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

export function FlashcardCarousel({ set }: { set: ExtendedFlashcardSet }) {
  const [index, setIndex] = useState<number>(0);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const [noPagination, setNoPagination] = useState<boolean>(true);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  function paginate(direction: -1 | 1) {
    setNoPagination(false);
    if (index + direction != set.flashcards.length && index + direction >= 0) {
      setDirection(direction);
      console.log(index);
      setIndex(index + direction);
      console.log(index);
    }
  }

  return (
    <div className="w-full flex flex-col space-y-2 overflow-x-hidden">
      {set.flashcards.map((flashcard, i) => {
        return (
          <>
            {i == index && (
              <AnimatePresence initial={!noPagination}>
                <motion.div
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    ease: "easeInOut",
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                >
                  <FlashcardDisplay
                    index={index}
                    flashcard={flashcard}
                    set={set}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </>
        );
      })}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => paginate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => paginate(1)}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-muted-foreground font-medium">
          {index + 1} / {set.flashcards.length}
        </p>
      </div>
    </div>
  );
}
