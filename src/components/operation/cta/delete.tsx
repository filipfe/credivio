import { deleteOperations } from "@/lib/operation/actions";
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
import { Fragment, useTransition } from "react";

type Props = {
  items: Set<any> | "all";
  count: number;
  type: OperationType | "stock";
};

export default function Delete({ items, type, count }: Props) {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div>
      <Button onPress={onOpen} color="danger" variant="light">
        <Trash2Icon size={14} />
        Usuń {`(${items === "all" ? count : Array.from(items).length})`}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Fragment>
              <ModalHeader className="flex justify-center mt-4">
                <p className="font-normal text-center">
                  Czy na pewno chcesz usunąć przedmioty?
                </p>
              </ModalHeader>
              <ModalBody>
                <p className="font-normal text-center text-sm">
                  Ta akcja jest nieodwracalna, upewnij się, że usuwasz poprawne
                  przedmioty przed jej zatwierdzeniem
                </p>
              </ModalBody>
              <ModalFooter>
                <form
                  action={(e) =>
                    startTransition(async () => {
                      const { error } = await deleteOperations(e);
                      console.log(error);
                      onClose();
                    })
                  }
                >
                  <input
                    type="hidden"
                    name="data"
                    value={
                      items === "all"
                        ? "all"
                        : JSON.stringify(Array.from(items))
                    }
                  />
                  <input type="hidden" name="type" value={type} />
                  <Button
                    isLoading={isPending}
                    type="submit"
                    color="danger"
                    variant="light"
                  >
                    Usuń
                  </Button>
                </form>
              </ModalFooter>
            </Fragment>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
