import { useEffect } from "react";

export function useTextareaAutosize(
  ref: HTMLTextAreaElement | null,
  value: string,
) {
  useEffect(() => {
    if (ref) {
      ref.style.height = "0px";
      const scrollHeight = ref.scrollHeight;

      ref.style.height = scrollHeight + "px";
    }
  }, [ref, value]);
}
