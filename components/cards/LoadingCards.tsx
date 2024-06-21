import { useId } from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardHeader } from "../ui/card";

export function LoadingCards() {
  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
      {Array(3)
        .fill("")
        .map((s) => (
          <Card key={useId()} className="md:min-h-[175px]">
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-5/5" />
            </CardHeader>
          </Card>
        ))}
    </div>
  );
}
