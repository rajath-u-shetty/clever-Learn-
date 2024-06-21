"use client";

import { Message } from "ai";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Check, Copy } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { useCopy } from "@/lib/hooks/use-copy";
import { SiOpenai } from "react-icons/si";

export function ChatMessage({ message }: { message: Message }) {
  const { data: session } = useSession();

  const { copied, copyToClipboard } = useCopy(message.content);

  return (
    <div className=" first:pt-0 py-10 border-b last:border-none flex-1 flex w-full relative">
      <div className="flex w-full gap-4 mx-auto mr-4 items-start">
        {message.role == "user" ? (
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={session?.user.image!} />
            <AvatarFallback className="h-8 w-8 bg-secondary" />
          </Avatar>
        ) : (
          <div className="w-8 h-8 bg-primary shrink-0 rounded-lg flex items-center justify-center">
            <div className="h-4 w-4 text-background">
              <SiOpenai />
            </div>
          </div>
        )}
        <MarkdownRenderer content={message.content} />
      </div>
      {message.role == "assistant" && (
        <div className="absolute top-4 right-0">
          {copied ? (
            <div className="h-7 w-7">
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-7 w-7"
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(message.content)}
                  >
                    {" "}
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </div>
  );
}
