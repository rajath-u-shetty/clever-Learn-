"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useMutation, useQueryClient } from "react-query";
import * as z from "zod";
import { toast } from "../ui/use-toast";
import { Check, Edit, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DeleteDialog } from "../cards/DeleteDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  question: z
    .string()
    .min(2, { message: "The question must be at least 2 characters" }),
  answer: z
    .string()
    .min(2, { message: "The answer must be at least 2 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

import { Flashcard } from "@prisma/client";
import { ExtendedFlashcardSet } from "@/types/prisma";

export function CardMore({
  flashcard,
  set,
}: {
  flashcard: Flashcard;
  set: ExtendedFlashcardSet;
}) {
  const queryClient = useQueryClient();

  const { mutate: updateItem, isLoading: isUpdating } = useMutation({
    mutationFn: async (values: FormValues): Promise<Flashcard> => {
      const res = await fetch(`/api/flashcard-sets/flashcard/${flashcard.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["sets", { id: flashcard.setId }],
      });
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Successfully updated this flashcard!
          </p>
        ),
      });
    },
  });

  const { mutate: deleteItem, isLoading: isItemDeleting } = useMutation({
    mutationFn: async (): Promise<Flashcard> => {
      const res = await fetch(`/api/flashcard-sets/flashcard/${flashcard.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["sets", { id: flashcard.setId }],
      });
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4  mr-2" />
            Successfully deleted the flashcard.
          </p>
        ),
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: flashcard.answer,
      question: flashcard.question,
    },
  });

  function onSubmit(values: FormValues) {
    updateItem(values);
  }

  return (
    <Dialog>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <MoreVertical className="h-4 w-4" />
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
        <DeleteDialog
          deleteFunction={() => {
            if (set.flashcards.length == 1) {
              toast({
                title: "Uh oh, something went wrong!",
                description: (
                  <p>
                    You can't delete the only flashcard in the set, delete the
                    set instead.
                  </p>
                ),
                variant: "destructive",
              });
            } else {
              deleteItem();
            }
          }}
          isDeleting={isItemDeleting}
        />
      </AlertDialog>
      <DialogContent className="max-w-[425px] md:max-w-[525px] !rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Edit this flashcard's answer and question.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the flashcard question..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the flashcard answer..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit{" "}
              {isUpdating && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
