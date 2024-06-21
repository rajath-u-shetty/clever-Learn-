import { useInView } from "react-intersection-observer";
import { useAtBottom } from "@/lib/hooks/use-at-bottom";
import { useEffect, useRef } from "react";
import { Message } from "ai";

export function ChatScrollAnchor({
  trackVisibility,
  messages,
}: {
  trackVisibility: boolean;
  messages: Message[];
}) {
  const initRef = useRef<HTMLDivElement | null>(null);

  const isAtBottom = useAtBottom();
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: "0px 0px -150px 0px",
  });

  useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: "start",
        behavior: "auto",
      });
    }
  }, [inView, entry, isAtBottom, trackVisibility]);

  useEffect(() => {
    entry?.target?.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  }, [messages.length, messages[messages.length - 1]?.content.length]);

  useEffect(() => {
    initRef?.current?.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  }, []);

  return (
    <>
      <div ref={ref} className="h-px w-full" />
      <div ref={initRef} className="h-px w-full" />
    </>
  );
}
