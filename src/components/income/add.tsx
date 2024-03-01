"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { Fragment } from "react";

export default function AddIncome() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <Fragment>
      <Button
        onPress={onOpen}
        className="rounded-md text-white flex items-center gap-2"
        color="primary"
        variant="shadow"
      >
        <PlusIcon className="mt-0.5" color="white" size={16} />
        Nowy
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Fragment>
              <ModalHeader>Dodaj przychód</ModalHeader>
              <ModalBody>
                <RadioGroup label="Wybierz sposób">
                  <Radio value="csv">Import CSV</Radio>
                  <Radio value="manual">Ręcznie</Radio>
                </RadioGroup>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </Fragment>
          )}
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
