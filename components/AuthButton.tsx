"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";

export function AuthButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      onClick={() => {
        setIsLoading(true);
        signIn("google");
        setIsLoading(false);
      }}
      className="w-full"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FaGoogle className="h-4 w-4 mr-2" />
      )}
      Continue With Google{" "}
    </Button>
  );
}
