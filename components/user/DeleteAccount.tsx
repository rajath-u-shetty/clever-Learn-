"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";
import { toast } from "../ui/use-toast";
import { useMutation } from "react-query";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export function DeleteAccount() {
  const { mutate: deletAccount } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user", {
        method: "DELETE",
      });
      const data = await res.json();
      return data;
    },
    onError: (data) => {
      console.log(data);
      toast({
        title: "Uh oh, something went wrong!",
        description: (
          <p>
            Oops, there was an error saving your deleting your account. Please
            try again.
          </p>
        ),
        variant: "destructive",
      });
    },
  });

  const [confirmInput, setConfirmInput] = useState<string>("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="md:w-fit">
          <AlertCircle className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? Deleting your account
            is permanent and will delete all your data forever.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label className="text-muted-foreground font-light">
            Type{" "}
            <span className="font-bold">
              I confirm that I am about to delete my account
            </span>{" "}
            to confirm.
          </Label>
          <Input
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={
              confirmInput != "I confirm that I am about to delete my account"
            }
            onClick={() => deletAccount()}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Yes, Delete Account Forever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
