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
import { Fragment } from "react";

type Props = {
  items: any[];
};

export default function Delete({ items }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div>
      <Button onPress={onOpen} color="danger" variant="light">
        <Trash2Icon size={14} />
        Usuń {`(${items.length})`}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Fragment>
              <ModalHeader></ModalHeader>
              <ModalBody className="font-normal text-center">
                Czy na pewno chcesz usunąć przedmioty?
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} color="danger" variant="light">
                  Usuń
                </Button>
              </ModalFooter>
            </Fragment>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
