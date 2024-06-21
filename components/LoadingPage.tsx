"use client";

import { loadingTexts } from "@/config/loading-texts";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";

export function LoadingPage({ finished }: { finished: boolean }) {
  const [progress, setProgess] = useState<number>(0);
  const [currText, setCurrText] = useState<(typeof loadingTexts)[number]>(
    loadingTexts[0],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setCurrText(loadingTexts[randomIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgess((prev) => {
        if (Math.random() < 0.1) return prev + 4;
        if (prev >= 100) return 0;
        if (finished) return 100;
        return prev + 2;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const { theme } = useTheme();

  return (
    <motion.div
      className="absolute inset-0 bg-background flex justify-center w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center space-y-10 w-full">
        <Image
          src={"/images/loading-light.gif"}
          height={500}
          width={500}
          alt="loading"
          className="dark:hidden"
        />
        <Image
          src={"/images/loading-dark.gif"}
          height={500}
          width={500}
          alt="loading"
          className="hidden dark:block"
        />
        <div className="space-y-3 w-3/4">
          <Progress value={progress} className="h-3 w-full" />
          <p className="text-center font-medium text-lg">{currText}</p>
        </div>
      </div>
    </motion.div>
  );
}
