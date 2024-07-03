import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { SaveIcon } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import Manual from "../inputs/manual";
import { updateOperation } from "@/lib/operations/actions";
import toast from "react-hot-toast";
import Toast from "@/components/ui/toast";
import LabelInput from "../inputs/label";

type Props = {
  edited: Operation | null;
  setEdited: Dispatch<SetStateAction<Operation | null>>;
  type: OperationType;
  onEdit?: (updated: Operation) => void;
};

export default function EditModal({ type, edited, onEdit, setEdited }: Props) {
  const [isPending, startTransition] = useTransition();
  const [updated, setUpdated] = useState(edited);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    edited && onOpen();
    setUpdated(edited);
  }, [edited]);

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => setEdited(null)}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="font-normal">
              <span>
                Edytuj wydatek{" "}
                <span className="font-bold">{edited?.title}</span>
              </span>
            </ModalHeader>
            <ModalBody className="relative flex items-center justify-center min-h-48 py-0 [&:has(+button)]:z-40 my-3">
              {updated && <Manual value={updated} />}
              {type === "expense" && (
                <div className="w-full">
                  <LabelInput
                    value={updated?.label}
                    onChange={(label) =>
                      setUpdated((prev) => (prev ? { ...prev, label } : null))
                    }
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                disableRipple
                isDisabled={isPending}
                disabled={isPending}
                onClick={onClose}
              >
                Anuluj
              </Button>
              {onEdit ? (
                <Button
                  color="primary"
                  disableRipple
                  isLoading={isPending}
                  isDisabled={isPending}
                  disabled={isPending}
                  onClick={() => {
                    updated && onEdit(updated);
                    onClose();
                  }}
                >
                  {!isPending && <SaveIcon size={16} />}
                  Zapisz
                </Button>
              ) : (
                <form
                  action={(formData) =>
                    startTransition(async () => {
                      const res = await updateOperation(formData);
                      if (res?.error) {
                        toast.custom((t) => (
                          <Toast {...t} type="error" message={res.error} />
                        ));
                      } else {
                        onClose();
                        toast.custom((t) => (
                          <Toast
                            {...t}
                            type="success"
                            message={`Pomyślnie zmodyfikowano operację ${edited?.title}!`}
                          />
                        ));
                      }
                    })
                  }
                >
                  <Button
                    color="primary"
                    disableRipple
                    type="submit"
                    isLoading={isPending}
                    isDisabled={isPending}
                    disabled={isPending}
                  >
                    {!isPending && <SaveIcon size={16} />}
                    Zapisz
                  </Button>
                  <input
                    type="hidden"
                    name="operation"
                    value={JSON.stringify(updated)}
                  />
                  <input type="hidden" name="type" value={type} />
                </form>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
