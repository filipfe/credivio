import Toast from "@/components/ui/toast";
import { deleteRows } from "@/lib/general/actions";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Trash2Icon } from "lucide-react";
import { Fragment, useEffect, useTransition } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";

type Props = {
  deleted: Operation[];
  type: OperationType;
  onClose: () => void;
};

export default function DeleteModal({ deleted, type, onClose }: Props) {
  const { mutate } = useSWRConfig();
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (deleted.length === 0) return;
    onOpen();
  }, [deleted]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="font-normal text-center">
              <p className="text-center w-full inline-block">
                Usunąć{" "}
                {deleted.length === 1 ? (
                  <Fragment>
                    <span>operację</span>{" "}
                    <span className="font-bold">{deleted[0].title}</span>
                  </Fragment>
                ) : (
                  "operacje"
                )}
                ?
              </p>
            </ModalHeader>
            <ModalBody className="relative flex items-center justify-center min-h-12 py-0 [&:has(+button)]:z-40 my-3">
              <p className="text-font/80 text-sm text-center">
                Ta akcja jest nieodwracalna! Upewnij się, że usuwasz poprawne
                operacje przed zatwierdzeniem
              </p>
            </ModalBody>
            <ModalFooter>
              <Button disableRipple onPress={onClose}>
                Anuluj
              </Button>
              <form
                action={(formData) =>
                  startTransition(async () => {
                    const { error } = await deleteRows(
                      JSON.parse(formData.get("data")!.toString()),
                      formData.get("type")!.toString()
                    );
                    if (error) {
                      toast.custom((t) => (
                        <Toast {...t} type="error" message={error} />
                      ));
                    } else {
                      await Promise.all(
                        deleted.map((op) => mutate(["limits", op.currency]))
                      );
                      onClose();
                      toast.custom((t) => (
                        <Toast
                          {...t}
                          type="success"
                          message={`Pomyślnie usunięto ${
                            deleted.length === 1
                              ? `operację ${deleted[0].title}`
                              : "operacje"
                          }!`}
                        />
                      ));
                    }
                  })
                }
              >
                <Button
                  disableRipple
                  color="danger"
                  type="submit"
                  isLoading={isPending}
                  isDisabled={isPending}
                  disabled={isPending}
                >
                  {!isPending && <Trash2Icon size={16} />}
                  Usuń
                </Button>
                <input
                  type="hidden"
                  name="data"
                  value={JSON.stringify(deleted.map((item) => item.id))}
                />
                <input type="hidden" name="type" value={type} />
              </form>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
