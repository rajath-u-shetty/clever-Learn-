"use client";

import { Quiz } from "@prisma/client";
import { useMutation, useQueryClient } from "react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Check, Edit, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { DeleteDialog } from "../cards/DeleteDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useState } from "react";

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Your title must be at least 5 characters." })
    .max(50, { message: "Your title must be less than 50 characters." }),
  description: z
    .string()
    .min(5, { message: "Your description must be at least 5 characters." })
    .max(200, { message: "Your title must be less than 200 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export function QuizSettings({ quiz }: { quiz: Quiz }) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const { mutate: editQuiz, isLoading: isQuizEditing } = useMutation({
    mutationFn: async (values: FormValues): Promise<Quiz> => {
      const res = await fetch(`/api/quizzes/${quiz.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["quizzes", { id: quiz.id }] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setOpen(false);
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Successfully edited the quiz.
          </p>
        ),
      });
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the quiz.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  const { mutate: deleteQuiz, isLoading: isQuizDeleting } = useMutation({
    mutationFn: async (): Promise<Quiz> => {
      const res = await fetch(`/api/quizzes/${quiz.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (pathname != "/quizzes") {
        router.push("/quizzes");
      }
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4  mr-2" />
            Successfully deleted the quiz.
          </p>
        ),
      });
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p>There was an error deleting the quiz. Please try again.</p>
        ),
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: quiz.title,
      description: quiz.description,
    },
  });

  const onSubmit = (values: FormValues) => editQuiz(values);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="!text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DeleteDialog deleteFunction={deleteQuiz} isDeleting={isQuizDeleting} />
      </AlertDialog>
      <DialogContent className="max-w-[425px] md:max-w-[525px] !rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Edit the quiz title and description.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the quiz title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the quiz description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit{" "}
              {isQuizEditing && (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
