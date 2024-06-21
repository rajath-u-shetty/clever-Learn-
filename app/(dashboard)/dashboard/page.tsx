"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ExtendedUser } from "@/types/prisma";
import {
  Activity,
  ArrowRight,
  Copy,
  FileText,
  MessagesSquare,
  StickyNote
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { title } from "process";
import { useId } from "react";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";

const cards = [
  {
    title: "Quizzes",
    icon: <FileText className="h-4 w-4 mr-2" />,
    description: "View, create, edit, and delete AI generated quizes!",
    href: "/quizzes",
  },
  {
    title: "Flashcards",
    icon: <Copy className="h-4 w-4 mr-2" />,
    description: "View, create, edit, and delete AI generated flashcard sets!",
    href: "/flashcard-sets",
  },
  {
    title: "AI tutors",
    icon: <MessagesSquare className="h-4 w-4 mr-2" />,
    description: "View, create, edit, and deleted AI tutors!",
    href: "/tutors",
  },{
    title: "Summary",
    icon: <StickyNote className="h-4 w-4 mr-2" />,
    description: "Summarise youtube videos",
    href: "/summarise"
  }
];

export default function DashboardPage() {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<ExtendedUser> => {
      const res = await fetch("/api/user");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the dashboard.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  return (
    <main className="flex-1 px-4 py-10 md:py-16 max-w-4xl xl:max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-muted-foreground font-medium ">
          Welcome back{" "}
          {isLoading ? (
            <span className="animate-pulse">...</span>
          ) : (
            user?.name + "!"
          )}
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Monthly Generations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  user?.generations.length
                )}{" "}
                /{" "}
                {user?.unlimited
                  ? "Unlimited"
                  : process.env.NEXT_PUBLIC_GENERATION_LIMIT}
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Pro plan coming soon...
              </p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Generations Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="flex flex-col space-y-4">
                  {Array(3)
                    .fill("")
                    .map((s, i) => (
                      <Skeleton
                        className={cn(
                          "h-4",
                          i == 0 ? "w-4/5" : i == 1 ? "w-3/5" : "w-2/5",
                        )}
                        key={uuidv4()}
                      />
                    ))}
                </div>
              ) : (
                <ul className="flex flex-col space-y-2 text-muted-foreground">
                  <li>
                    <Link href="/flashcard-sets">
                      {
                        user.generations.filter(
                          (generation) => generation.type == "flashcard-set",
                        ).length
                      }{" "}
                      Flashcard Sets
                    </Link>
                  </li>
                  <Separator />
                  <li>
                    <Link href="/quizzes">
                      {
                        user.generations.filter(
                          (generation) => generation.type == "quiz",
                        ).length
                      }{" "}
                      Quizzes
                    </Link>
                  </li>
                  <Separator />
                  <li>
                    <Link href="/tutors">
                      {
                        user.generations.filter(
                          (generation) => generation.type == "tutor",
                        ).length
                      }{" "}
                      Tutors
                    </Link>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              href={card.href}
              key={useId()}
              className="hover:opacity-70 duration-500"
            >
              <Card className="flex justify-between items-center h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {card.icon}
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex-1 grid md:grid-cols-2 gap-4">
          <Card className="relative pb-14">
            <CardHeader>
              <CardTitle>Recent Quiz Attempts</CardTitle>
              <CardDescription>
                Some of your recent quiz attempts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-6">
                {isLoading ? (
                  <>
                    {Array(3)
                      .fill("")
                      .map((s) => (
                        <div className="flex flex-col space-y-2" key={uuidv4()}>
                          <Skeleton className="h-4 w-5/5" />
                          <Skeleton className="h-4 w-4/5" />
                        </div>
                      ))}
                  </>
                ) : (
                  user && (
                    <>
                      {user.quizAttempts.map((attempt) => (
                        <div className="flex flex-col space-y-1" key={uuidv4()}>
                          <div className="flex items-center gap-3.5">
                            <Link
                              href={`/quizzes/${attempt.quizId}/attempt/${attempt.id}`}
                              className="font-semibold underline"
                            >
                              {attempt.quiz.title}
                            </Link>
                            <CreatedAt
                              createdAt={new Date(
                                attempt.createdAt,
                              ).toLocaleDateString()}
                            />
                          </div>
                          <p className="font-bold">
                            {Math.round(Number(attempt.score) * 100 * 100) / 100}%
                          </p>
                        </div>
                      ))}
                    </>
                  )
                )}
              </div>
            </CardContent>
            <CardFooter className="absolute bottom-0">
              <Link href="/flashcard=sets">
                <Button variant="ghost">
                  {" "}
                  View all <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <div className="flex-1 grid gap-4">
            <Card className="relative pb-14">
              <CardHeader>
                <CardTitle>Recent AI Tutor</CardTitle>
                <CardDescription>
                  Some of the AI tutors you created recently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  {isLoading ? (
                    <>
                      {Array(3)
                        .fill("")
                        .map((s) => (
                          <div
                            className="flex flex-col space-y-2"
                            key={uuidv4()}
                          >
                            <Skeleton className="h-4 w-5/5" />
                            <Skeleton className="h-4 w-4/5" />
                          </div>
                        ))}
                    </>
                  ) : (
                    user && (
                      <>
                        {user.tutors.map((tutor) => (
                          <div
                            className="flex items-center gap-3.5"
                            key={uuidv4()}
                          >
                            <Link
                              href={`/tutor/${tutor.id}`}
                              className="font-semibold underline"
                            >
                              {tutor.title}
                            </Link>
                            <CreatedAt
                              createdAt={new Date(
                                tutor.createdAt,
                              ).toLocaleDateString()}
                            />
                          </div>
                        ))}
                      </>
                    )
                  )}
                </div>
              </CardContent>
              <CardFooter className="absolute bottom-0">
                <Link href="/tutors">
                  <Button variant="ghost">
                    {" "}
                    View all <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="relative pb-14">
              <CardHeader>
                <CardTitle>Recent Flashcards</CardTitle>
                <CardDescription>
                  Some of the flashcard sets you created recently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  {isLoading ? (
                    <>
                      {Array(3)
                        .fill("")
                        .map((s) => (
                          <div
                            className="flex flex-col space-y-2"
                            key={uuidv4()}
                          >
                            <Skeleton className="h-4 w-5/5" />
                            <Skeleton className="h-4 w-4/5" />
                          </div>
                        ))}
                    </>
                  ) : (
                    user && (
                      <>
                        {user.flashcardSets.map((flashcardSet) => (
                          <div
                            className="flex items-center gap-3.5"
                            key={uuidv4()}
                          >
                            <Link
                              href={`/flashcard-set/${flashcardSet.id}`}
                              className="font-semibold underline"
                            >
                              {flashcardSet.title}
                            </Link>
                            <CreatedAt
                              createdAt={new Date(
                                flashcardSet.createdAt,
                              ).toLocaleDateString()}
                            />
                          </div>
                        ))}
                      </>
                    )
                  )}
                </div>
              </CardContent>
              <CardFooter className="absolute bottom-0">
                <Link href="/quizzes">
                  <Button variant="ghost">
                    {" "}
                    View all <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          {/* <div className="w-full">
            <Card className="relative">
                  <CardHeader>
                    <CardTitle>Transcribe Video</CardTitle>
                    <CardDescription>Get summary from videos , Youtube links</CardDescription>
                  </CardHeader>
                  <CardContent>

                  </CardContent>
            </Card> 
         </div> */}
        </div>
      </div>
    </main>
  );
}

function CreatedAt({ createdAt }: { createdAt: string }) {
  return (
    <div className="font-semibold text-[0.7rem] bg-primary text-background px-2 py-1.5 rounded-[0.5rem] w-fit">
      {createdAt}
    </div>
  );
}
