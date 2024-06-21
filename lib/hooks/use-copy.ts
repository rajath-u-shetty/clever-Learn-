import { useState } from "react";

export function useCopy(text: string) {
  const [copied, setCopied] = useState<boolean>(false);

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return {
    copied,
    copyToClipboard,
  };
}
