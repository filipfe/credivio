"use client";

import { Button } from "@nextui-org/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex flex-col gap-4 sm:gap-6 items-center justify-center">
      <h2 className="sm:text-lg lg:text-xl">{error.message}</h2>
      <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-black">
        Coś poszło nie tak!
      </h1>
      <Button color="primary" onPress={() => reset()} className="mt-4">
        Spróbuj ponownie
      </Button>
    </div>
  );
}
