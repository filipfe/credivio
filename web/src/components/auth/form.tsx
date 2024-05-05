"use client";

import { signInWithEmail } from "@/lib/auth/actions";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useTransition } from "react";

export default function Form() {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={(e) =>
        startTransition(async () => {
          const error = await signInWithEmail(e);
        })
      }
      className="flex flex-col gap-6"
    >
      <h1 className="text-3xl">Zaloguj się</h1>
      <Input
        classNames={{ inputWrapper: "!bg-light" }}
        name="email"
        label="Email"
        type="email"
        placeholder="example@mail.com"
        isRequired
      />
      <Button
        color="primary"
        isDisabled={isPending}
        isLoading={isPending}
        type="submit"
        className="text-white"
      >
        Zaloguj się
      </Button>
    </form>
  );
}
