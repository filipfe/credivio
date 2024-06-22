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
import { Fragment, useTransition } from "react";

type Props = {
  items: string[];
  type?: OperationType;
  viewOnly?: boolean;
  callback?: () => void;
};

export default function Delete({ items, type, viewOnly, callback }: Props) {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div>
      <div>
        <Badge content={items.length} color="danger" size="lg">
          <Button
            isIconOnly
            disableRipple
            onClick={onOpen}
            color="danger"
            variant="flat"
          >
            <Trash2Icon size={16} />
          </Button>
        </Badge>
      </div>
      {!viewOnly && (
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
                    Ta akcja jest nieodwracalna, upewnij się, że usuwasz
                    poprawne przedmioty przed jej zatwierdzeniem
                  </p>
                </ModalBody>
                <ModalFooter>
                  <form
                    action={(formData) =>
                      startTransition(async () => {
                        const { error } = await deleteRows({ formData });
                        !error && callback && callback();
                        onClose();
                      })
                    }
                  >
                    <input
                      type="hidden"
                      name="data"
                      value={JSON.stringify(items)}
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
      )}
    </div>
  );
}
