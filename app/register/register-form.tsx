"use client";

import { useFormState, useFormStatus } from "react-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerMember, type RegisterState } from "./actions";

const initialState: RegisterState = {
  ok: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending} type="submit">
      <UserPlus className="h-4 w-4" />
      {pending ? "Creating account" : "Create member account"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, action] = useFormState(registerMember, initialState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="name">
          Name
        </label>
        <input
          className="focus-ring mt-2 h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-ink"
          id="name"
          name="name"
          required
          type="text"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="email">
          Email
        </label>
        <input
          className="focus-ring mt-2 h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-ink"
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
          id="password"
          minLength={8}
          name="password"
          required
          type="password"
        />
      </div>
      {state.message ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            state.ok ? "border-green-200 bg-green-50 text-success" : "border-red-200 bg-red-50 text-danger"
          }`}
        >
          {state.message}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
