"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tutor } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as z from "zod";
import { toast } from "../ui/use-toast";
import { Check, Edit, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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

export function TutorSettings({ tutor }: { tutor: Tutor }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: tutor.title,
      description: tutor.description,
    },
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const { mutate: editTutor, isLoading: isTutorEditing } = useMutation({
    mutationFn: async ({ title, description }: FormValues): Promise<Tutor> => {
      const res = fetch(`/api/tutors/${tutor.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = (await res).json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["tutors", { id: tutor.id }] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setOpen(false);
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Successfully edited the AI tutor.
          </p>
        ),
      });
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error editing the AI tutor.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  const { mutate: deleteTutor, isLoading: isTutorDeleting } = useMutation({
    mutationFn: async (): Promise<Tutor> => {
      const res = fetch(`/api/tutors/${tutor.id}`, {
        method: "DELETE",
      });

      const data = (await res).json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (pathname != "/tutors") {
        router.push("/tutors");
      }
      queryClient.invalidateQueries({ queryKey: ["tutors"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4  mr-2" />
            Successfully deleted the AI tutor.
          </p>
        ),
      });
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p>There was an error deleting the AI tutor. Plese try again.</p>
        ),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => editTutor(values);

  const [open, setOpen] = useState<boolean>(false);

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
        <DeleteDialog
          deleteFunction={deleteTutor}
          isDeleting={isTutorDeleting}
        />
      </AlertDialog>
      <DialogContent className="max-w-[425px] md:max-w-[525px] !rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Edit the tutor title and description.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-center space-x-2">
              <Button type="submit">
                Submit{" "}
                {isTutorEditing && (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
