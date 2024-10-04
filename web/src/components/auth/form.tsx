"use client";

import { signIn, signUp } from "@/lib/auth/actions";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useTransition } from "react";

export default function Form({
  children,
  isSignUp,
}: {
  children: React.ReactNode;
  isSignUp?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc(
        "get_dashboard_portfolio_budgets"
      );
      console.log({ data, error });
    })();
  }, []);
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
            {isSignUp ? "Zarejestruj się" : "Zaloguj się"}
          </Button>
          <p className="text-sm mt-4">
            {isSignUp ? "Posiadasz już konto?" : "Nie masz konta?"}{" "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="text-primary font-medium hover:text-primary/60 transition-colors"
            >
              {isSignUp ? "Zaloguj się" : "Zarejestruj się"}
            </Link>
          </p>
        </div>
        <div className="h-px bg-font/10 flex items-center justify-center my-2">
          <div className="px-2 bg-white mb-1">
            <span className="text-tiny text-font/40">LUB</span>
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
          <span className="mb-0.5">Zaloguj się z Google</span>
        </button>
      </div>
    </form>
  );
}
