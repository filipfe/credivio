"use client";

import numberFormat from "@/utils/formatters/currency";
import { useTransition } from "react";
import { deleteRecurringPayment } from "@/lib/recurring-payments/actions";
import toast from "react-hot-toast";
import Toast from "../../ui/toast";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { PauseIcon, Trash2Icon } from "lucide-react";

export default function ActiveRecurringPayment({
  id,
  title,
  next_payment_date,
  currency,
  type,
  amount,
}: RecurringPayment) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <h3 className="text-lg line-clamp-1">{title}</h3>
        <small className="text-neutral-500">
          Ostatnia płatność: {new Date(next_payment_date).toLocaleDateString()}{" "}
          | Następna płatność:{" "}
          {new Date(next_payment_date).toLocaleDateString()}
        </small>
      </div>
      <div className="flex items-end gap-2">
        <div
          className={`${
            type === "income"
              ? "bg-primary/10 text-primary"
              : "bg-danger-light text-danger"
          } rounded-md px-2 py-1 font-bold text-center`}
        >
          {(type === "income" ? "+" : "-") + numberFormat(currency, amount)}
        </div>
        <sub className="text-base mb-0.5">/ miesiąc</sub>
      </div>
      <div className="flex items-center gap-2">
        <Button onPress={onOpen} isIconOnly disableRipple size="sm">
          <PauseIcon size={16} />
        </Button>
        <Button
          className="bg-danger/5"
          onPress={onOpen}
          isIconOnly
          disableRipple
          size="sm"
        >
          <Trash2Icon size={16} className="text-danger" />
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center mt-4">
                <h4 className="font-medium text-lg text-center">
                  Czy na pewno chcesz usunąć płatność {title}?
                </h4>
              </ModalHeader>
              <ModalBody>
                <p className="text-font/80 text-center text-sm">
                  Upewnij się, że cykliczna płatność, którą próbujesz usunąć
                  jest właściwa. Ta akcja nie jest odwracalna!
                </p>
              </ModalBody>
              <ModalFooter>
                <form
                  action={(formData: FormData) => {
                    startTransition(async () => {
                      const { error } = await deleteRecurringPayment(formData);
                      if (error) {
                        toast.custom((t) => <Toast {...t} />);
                      } else {
                        onClose();
                      }
                    });
                  }}
                >
                  <input type="hidden" name="id" value={id} />
                  <Button
                    isDisabled={isPending}
                    color="primary"
                    className="font-medium"
                    type="submit"
                  >
                    Usuń
                  </Button>
                </form>
                <Button variant="light" onPress={onClose}>
                  Anuluj
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
