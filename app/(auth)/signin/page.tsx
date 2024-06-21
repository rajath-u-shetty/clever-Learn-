import { AuthButton } from "@/components/AuthButton";
import Link from "next/link";

export default function SignIn() {
  return (
    <main className="flex flex-col space-y-6 max-w-sm items-center text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          By continuing, you are setting up a Study AI account and agree to
          our User Agreement and Privacy Policy.
        </p>
      </div>
      <AuthButton />
      <p className="text-sm text-muted-foreground">
        New to Study AI?{" "}
        <Link className="underline" href="/signup">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
