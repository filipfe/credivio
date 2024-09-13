"use client";

import { FormHTMLAttributes, useTransition } from "react";
import toast from "@/utils/toast";
import { Button, ButtonProps, cn } from "@nextui-org/react";
import { Check, type LucideIcon } from "lucide-react";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  mutation: (formData: FormData) => Promise<SupabaseResponse<any> | undefined>;
  buttonProps?: ButtonProps & {
    icon?: LucideIcon;
  };
  callback?: () => void;
  successMessage?: string;
}

export default function Form({
  children,
  mutation,
  callback,
  className,
  successMessage,
  buttonProps: {
    children: buttonChildren,
    icon: ButtonIcon,
    className: buttonClassName,
    ...buttonProps
  } = { children: "Zapisz" },
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();

  const action = (formData: FormData) =>
    startTransition(async () => {
      const res = await mutation(formData);
      if (res?.error) {
        toast({
          type: "error",
          message: res.error,
        });
      } else if (callback) {
        callback();
      } else if (successMessage) {
        toast({
          type: "success",
          message: successMessage,
        });
      }
    });

  return (
    <form action={action} className={className} {...props}>
      {children}
      <div className="max-w-max ml-auto">
        <Button
          type="submit"
          disableRipple
          color="primary"
          isDisabled={isPending || buttonProps.disabled}
          className={cn("mt-6", buttonClassName)}
          {...buttonProps}
        >
          {isPending ? (
            <l-hatch size={14} color="#FFF" stroke={2} />
          ) : ButtonIcon ? (
            <ButtonIcon size={16} />
          ) : (
            <Check size={16} />
          )}
          {buttonChildren}
        </Button>
      </div>
    </form>
  );
}
