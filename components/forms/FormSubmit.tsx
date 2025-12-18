"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import * as z from "zod";
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
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

console.log(Number(process.env.NEXT_PUBLIC_MAX_NUM));

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Your title must be at least 5 characters." })
    .max(50, { message: "Your title must be less than 50 characters." }),
  num: z.coerce
    .number()
    .min(1, { message: "There is a minimum of 1." })
    .max(Number(process.env.NEXT_PUBLIC_MAX_NUM), {
      message: `There is a maximum of ${Number(process.env.NEXT_PUBLIC_MAX_NUM)}.`,
    }),
  description: z
    .string()
    .min(5, { message: "Your description must be at least 5 characters." })
    .max(200, { message: "Your title must be less than 200 characters." }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "You need to select a difficulty.",
  }),
});

export type FormSubmitVaues = z.infer<typeof formSchema>;

export function FormSubmit({
  isLoading,
  itemType,
  onSubmit,
  onBack,
  className,
}: {
  isLoading: boolean;
  itemType: "questions" | "cards" | "Summary";
  onSubmit: (values: FormSubmitVaues) => any;
  onBack: () => any;
  className?: string;
}) {
  const form = useForm<FormSubmitVaues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      num: 1,
      difficulty: "easy",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title..." {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Difficulty</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="easy" />
                    </FormControl>
                    <FormLabel className="font-normal">Easy</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="medium" />
                    </FormControl>
                    <FormLabel className="font-normal">Medium</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="hard" />
                    </FormControl>
                    <FormLabel className="font-normal">Hard</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="num"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of {itemType}</FormLabel>
              <FormControl>
                <Input type="number" {...field} max={Number(process.env.NEXT_PUBLIC_MAX_NUM)} min={1  } />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
          <Button onClick={onBack} variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button type="submit">
            Submit {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
