"use client";

import { useTextareaAutosize } from "@/lib/hooks/text-area-autosize";
import { UseChatHelpers } from "ai/react";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import { FormEvent, useRef } from "react";
import { Button } from "../ui/button";
import { useEnterSubmit } from "@/lib/hooks/user-enter-submit";

export function ChatForm({
  input,
  handleInputChange,
  isLoading,
  append,
  setInput,
}: Pick<
  UseChatHelpers,
  "input" | "handleInputChange" | "isLoading" | "append" | "setInput"
>) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { formRef, onKeyDown } = useEnterSubmit();
  useTextareaAutosize(textAreaRef.current, input);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input?.trim()) {
      return;
    }
    const value = input;
    setInput("");
    await append({
      content: value,
      role: "user",
    });
  }

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="fixed inset-x-0 bottom-0 p-4 bg-background border-t shadow-sm">
      <form
        onSubmit={onSubmit}
        ref={formRef}
        className="flex flex-col gap-2 max-w-xl mx-auto border rounded-lg p-4 ring-offset-background focus-within:ring-2 ring-offset-2 ring-ring"
      >
        <textarea
          ref={textAreaRef}
          className="resize-none overflow-hidden bg-background text-sm font-medium focus:outline-none"
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          value={input}
          spellCheck
          placeholder="Send a message..."
        />
        <div className="self-end">
          <Button type="submit" disabled={isLoading} ref={buttonRef}>
            Send{" "}
            {isLoading ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ArrowRightCircle className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
