"use client";

import { signInWithEmail } from "@/lib/auth/actions";
import { Button, Input } from "@nextui-org/react";
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
      <div className="flex flex-col items-center text-center gap-2">
        <div className="bg-light rounded-md h-16 w-16 mb-4"></div>
        <h1 className="text-2xl font-medium">Witaj w Tipplet!</h1>
        <p className="text-sm">Zaloguj się, aby kontynuować</p>
      </div>
      <Input
        classNames={{ inputWrapper: "!bg-light" }}
        name="email"
        label="Email"
        type="email"
        placeholder="example@mail.com"
        labelPlacement="outside"
        isRequired
        autoComplete="off"
      />
      <Input
        classNames={{ inputWrapper: "!bg-light" }}
        name="password"
        label="Hasło"
        type="password"
        placeholder="**********"
        labelPlacement="outside"
        // isRequired
      />
      <Button
        color="primary"
        isDisabled={isPending}
        isLoading={isPending}
        type="submit"
        className="text-white font-medium"
      >
        Zaloguj się
      </Button>
      <div className="h-px bg-font/10 flex items-center justify-center my-2">
        <div className="px-2 bg-white mb-1">
          <span className="text-tiny text-font/40">LUB</span>
        </div>
      </div>
      <Button variant="faded">Zaloguj się z Google</Button>
    </form>
  );
}
