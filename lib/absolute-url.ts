import { usePathname } from "next/navigation";

export function useAbsoluteUrl(): string {
  const pathname = usePathname();
  return `${process.env.NEXT_PUBLIC_URL}${pathname}`;
}
