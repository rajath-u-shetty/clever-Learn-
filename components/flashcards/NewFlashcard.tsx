"use client";

import { useMutation, useQueryClient } from "react-query";
import * as z from "zod";
import { toast } from "../ui/use-toast";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FlashcardSet } from "@prisma/client";
import { ExtendedFlashcardSet } from "@/types/prisma";

const formSchema = z.object({
  question: z
    .string()
    .min(2, { message: "The question must be at least 2 characters" }),
  answer: z
    .string()
    .min(2, { message: "The answer must be at least 2 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export function NewFlashcard({ set }: { set: FlashcardSet }) {
  const queryClient = useQueryClient();

  const { mutate: add, isLoading: isAdding } = useMutation({
    mutationFn: async (values: FormValues): Promise<ExtendedFlashcardSet> => {
      const res = await fetch(`/api/flashcard-sets/${set.id}/new-flashcard`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["sets", { id: set.id }] });
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            New flashcard added to the set successfully.
          </p>
        ),
      });
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p>
            There was an error adding a new flashcard to the set. Please try
            again.
          </p>
        ),
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
      question: "",
    },
  });

  function onSubmit(values: FormValues) {
    add(values);
  }

  return (
    <DialogContent className="max-w-[425px] md:max-w-[525px] !rounded-lg">
      <DialogHeader>
        <DialogTitle>Add new flashcard</DialogTitle>
        <DialogDescription>
          Add a new flashcard to the set by entering a question and an answer.
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
                  <Input placeholder="Enter the item question..." {...field} />
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
                  <Input placeholder="Enter the item answer..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Submit{" "}
            {isAdding && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
