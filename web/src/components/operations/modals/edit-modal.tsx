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
};

export default function EditModal({ type, edited, setEdited }: Props) {
  const [isPending, startTransition] = useTransition();
  const [updated, setUpdated] = useState(edited);
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    edited && onOpen();
    setUpdated(edited);
  }, [edited]);

  const isDisabled =
    !!updated &&
    !!edited &&
    Object.entries(edited).every(
      ([key, value]) => updated[key as keyof Operation] == value
    );

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
            <ModalHeader>Edytuj wydatek {edited?.title}</ModalHeader>
            <ModalBody className="relative flex items-center justify-center min-h-48 py-0 [&:has(+button)]:z-40 my-3">
              {updated && (
                <Manual
                  operation={updated}
                  onChange={(key, value) =>
                    setUpdated((prev) =>
                      prev ? { ...prev, [key]: value } : null
                    )
                  }
                />
              )}
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
                  isDisabled={isDisabled || isPending}
                  disabled={isDisabled || isPending}
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
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
