"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { DeleteAccount } from "@/components/user/DeleteAccount";
import { ExtendedUser } from "@/types/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { ToastAction } from "@radix-ui/react-toast";
import { Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email("An email is required."),
  image: z.string().url("Image is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function Settings() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { update } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<ExtendedUser> => {
      const res = await fetch("/api/user");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onSuccess: async (data) => {
      form.setValue("name", data.name!);
      form.setValue("email", data.email!);
      form.setValue("image", data.image!);
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>Oops, there was an error loading your settings.</p>,
        variant: "destructive",
        action: (
          <ToastAction onClick={() => router.refresh()} altText="Try again">
            Try again
          </ToastAction>
        ),
      });
    },
  });

  const { mutate: updateProfile, isLoading: updating } = useMutation({
    mutationFn: async (values: FormValues): Promise<User> => {
      const res = await fetch("/api/user", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p>
            Oops, there was an error saving your profile information. Please try
            again.
          </p>
        ),
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      update();
      toast({
        description: (
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Successfully updated your profile!
          </p>
        ),
      });
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    updateProfile(values);
  }

  useEffect(() => {
    console.log(form.getValues("image"));
  }, [form.getValues("image")]);

  return (
    <main className="flex-1 px-4 py-10 md:py-16 max-w-4xl xl:max-w-5xl mx-auto w-full flex flex-col gap-12">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold">General Settings</h1>
        <p className="text-muted-foreground font-medium">
          Manage your account settings and email preferences.
        </p>
      </div>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-10">
            <Separator />
            <Form {...form}>
              <h3 className="font-semibold text-xl">Profile Information</h3>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid md:grid-cols-2 md:items-end gap-10"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter an image url..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Avatar className="h-12 w-12">
                  <AvatarImage src={form.getValues("image")} />
                </Avatar>
                <Button type="submit" className="md:w-fit">
                  Update Profile
                  {updating && (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <div className="flex flex-col gap-10">
            <Separator />
            <h3 className="font-semibold text-xl">Danger Zone</h3>
            <DeleteAccount />
          </div>
        </>
      )}
    </main>
  );
}
