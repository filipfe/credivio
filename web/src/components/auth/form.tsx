"use client";

import { Dict } from "@/const/dict";
import { signIn, signUp } from "@/lib/auth/actions";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export default function Form({
  children,
  isSignUp,
  dict,
}: {
  children: React.ReactNode;
  isSignUp?: boolean;
  dict: Dict["public"]["auth"]["_layout"] &
    (Dict["public"]["auth"]["sign-in"] | Dict["public"]["auth"]["sign-up"]);
}) {
  const { lang } = useParams();
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          const { error } = isSignUp
            ? await signUp(formData)
            : await signIn(formData);
          console.log({ error });
        })
      }
    >
      <input type="hidden" name="lang" value={lang} />
      {children}
      <div className="flex flex-col gap-6 mt-6">
        <div>
          <Button
            color="primary"
            isDisabled={isPending}
            isLoading={isPending}
            disableRipple
            type="submit"
            className="text-white font-medium w-full"
          >
            {dict.form._submit.label}
          </Button>
          <p className="text-sm mt-4">
            {dict.swap.label}{" "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="text-primary font-medium hover:text-primary/60 transition-colors"
            >
              {dict.swap.link}
            </Link>
          </p>
        </div>
        <div className="h-px bg-font/10 flex items-center justify-center my-2">
          <div className="px-2 bg-white mb-1">
            <span className="text-tiny text-font/40 uppercase">{dict.or}</span>
          </div>
        </div>
        <button
          type="button"
          className="border bg-light rounded-md text-sm flex items-center gap-2 justify-center h-10"
        >
          <Image
            className="max-w-5"
            width={240}
            height={240}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/240px-Google_%22G%22_logo.svg.png"
            alt="Google Logo"
          />
          <span className="mb-0.5">{dict.google.label}</span>
        </button>
      </div>
    </form>
  );
}
