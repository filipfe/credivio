import numberFormat from "@/utils/formatters/currency";
import Menu from "./menu";

export default function ActiveRecurringPayment({
  title,
  next_payment_date,
  last_payment_date,
  currency,
  type,
  amount,
  interval_amount,
  interval_unit,
}: RecurringPayment) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <h3 className="text-lg line-clamp-1">{title}</h3>
        <small className="text-neutral-500">
          Ostatnia płatność: {new Date(last_payment_date).toLocaleDateString()}{" "}
          | Następna płatność:{" "}
          {new Date(next_payment_date).toLocaleDateString()}
        </small>
      </div>
      <div className="flex items-end gap-2">
        <div
          className={`${
            type === "income"
              ? "bg-success/10 text-success"
              : "bg-danger-light text-danger"
          } rounded-md px-2 py-1 font-bold text-center`}
        >
          {(type === "income" ? "+" : "-") + numberFormat(currency, amount)}
        </div>
        <sub className="text-base mb-0.5">
          / {interval_amount} {interval_unit}
        </sub>
      </div>
      <Menu />
      {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
      </Modal> */}
    </div>
  );
}
