"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SearchAlert } from "@/components/alerts/SearchAlert";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { EmptyAlert } from "@/components/alerts/EmptyAlert";
import { YouTubeSummary } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LoadingCards } from "@/components/cards/LoadingCards";
import { ListCard } from "@/components/cards/ListCard";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SummariesPage() {
  const router = useRouter();

  const { data: disabled, isLoading: disabledLoading } = useQuery({
    queryKey: ["limit"],
    queryFn: async (): Promise<boolean> => {
      const res = await fetch("/api/limit");
      const data = await res.json();
      return data;
    },
  });

  const { data: summarise, isLoading: summariseLoading } = useQuery({
    queryKey: ["summarise"],
    queryFn: async (): Promise<YouTubeSummary[]> => {
      const res = await fetch("/api/summarise"); // Adjust API endpoint as per your backend setup
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading your YouTube summarise.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  const [search, setSearch] = useState("");

  return (
    <div className="flex-1 px-4 py-10 md:py-16 max-w-5xl xl:max-w-6xl mx-auto w-full flex flex-col">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold">YouTube Summaries</h1>
        <p className="text-muted-foreground font-medium">
          Manage summarise of YouTube videos.
        </p>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search YouTube summarise..."
        />
        {disabledLoading ? (
          <Skeleton className="w-[125px] h-9 shrink-0" />
        ) : disabled ? (
          <Button disabled className="shrink-0">
            Add New... <Plus className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Link href="/summarise/new" className="shrink-0">
            <Button>
              Add New...
              <Plus className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>
      <div className="mt-6">
        {summariseLoading ? (
          <LoadingCards />
        ) : summarise ? (
          summarise.length === 0 ? (
            <EmptyAlert />
          ) : (
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
              {summarise.filter((summary) =>
                summary.videoTitle.toLowerCase().includes(search.toLowerCase()),
              ).length !== 0 ? (
                summarise
                  .filter((summary) =>
                    summary.videoTitle.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((summary) => (
                    <ListCard
                      key={summary.id}
                      title={summary.videoTitle}
                      description={summary.summary}
                      link={`/summarise/${summary.id}`}
                      itemType="Summary"
                      date={new Date(summary.createdAt)}
                    />
                  ))
              ) : (
                <SearchAlert />
              )}
            </div>
          )
        ) : (
          <ErrorAlert />
        )}
      </div>
    </div>
  );
}
