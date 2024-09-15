import { deleteRows } from "@/lib/general/actions";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import Toast from "../toast";

type Props = {
  items: string[];
  type: OperationType;
  viewOnly?: boolean;
  callback?: () => void;
};

export default function Delete({ items, type, viewOnly, callback }: Props) {
  // const [isPending, startTransition] = useTransition();
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <div>
        <Badge content={items.length} color="danger" size="lg">
          <Button
            isIconOnly
            disableRipple
            // onClick={onOpen}
            color="danger"
            variant="flat"
          >
            <Trash2Icon size={16} />
          </Button>
        </Badge>
      </div>
      {/* {!viewOnly && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="font-normal text-center">
                  <p className="text-center w-full inline-block">
                    Usunąć operacje ?
                  </p>
                </ModalHeader>
                <ModalBody className="relative flex items-center justify-center min-h-12 py-0 [&:has(+button)]:z-40 my-3">
                  <p className="text-font/80 text-sm text-center">
                    Ta akcja jest nieodwracalna! Upewnij się, że usuwasz
                    poprawne operacje przed zatwierdzeniem
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
                          onClose();
                          callback && callback();
                          toast.custom((t) => (
                            <Toast
                              {...t}
                              type="success"
                              message={`Pomyślnie usunięto operacje!`}
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
                      value={JSON.stringify(items)}
                    />
                    <input type="hidden" name="type" value={type} />
                  </form>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )} */}
    </div>
  );
}
