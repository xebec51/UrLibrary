"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        startTransition(async () => {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
          });

          if (result?.error) {
            setError("Email or password is invalid.");
            return;
          }

          window.location.href = result?.url ?? callbackUrl;
        });
      }}
    >
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="email">
          Email
        </label>
        <input
          className="focus-ring mt-2 h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-ink"
          defaultValue="member@urlibrary.demo"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="password">
          Password
        </label>
        <input
          className="focus-ring mt-2 h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-ink"
          defaultValue="Password123!"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <Button className="w-full" disabled={isPending} type="submit">
        <LogIn className="h-4 w-4" />
        {isPending ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
