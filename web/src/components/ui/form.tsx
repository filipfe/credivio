"use client";

import { FormHTMLAttributes, useTransition } from "react";
import toast from "@/utils/toast";
import { Button, ButtonProps, cn } from "@nextui-org/react";
import { Check, type LucideIcon } from "lucide-react";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  mutation?: (formData: FormData) => Promise<SupabaseResponse<any> | undefined>;
  buttonProps?: ButtonProps & {
    icon?: LucideIcon;
  };
  callback?: () => void;
  onClose?: () => void;
  successMessage?: string;
  buttonWrapperClassName?: string;
}

export default function Form({
  children,
  mutation,
  callback,
  id,
  onClose,
  className,
  buttonWrapperClassName,
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
      const res = await mutation!(formData);
      if (res?.error) {
        toast({
          type: "error",
          message: res.error,
        });
      } else {
        callback && callback();
        successMessage &&
          toast({
            type: "success",
            message: successMessage,
          });
      }
    });

  return (
    <form
      id={id}
      action={mutation ? action : undefined}
      className={className}
      {...props}
    >
      {children}
      <div
        className={cn(
          "max-w-max ml-auto flex items-center gap-3 mt-6",
          buttonWrapperClassName
        )}
      >
        {onClose && (
          <Button
            disableRipple
            isDisabled={isPending}
            disabled={isPending}
            onPress={onClose}
            className="border"
          >
            Anuluj
          </Button>
        )}
        <Button
          type="submit"
          disableRipple
          color="primary"
          form={id}
          isDisabled={isPending || buttonProps.disabled}
          className={cn(buttonClassName)}
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
