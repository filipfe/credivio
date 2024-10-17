"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Dispatch, FormEvent, SetStateAction, useEffect } from "react";
import Manual from "../inputs/manual";
import { updateOperation } from "@/lib/operations/actions";
import formDataToOperation from "@/utils/operations/form-data-to-operation";
import Form from "@/components/ui/form";
import { Dict } from "@/const/dict";

interface Props extends ReturnType<typeof useDisclosure> {
  dict: Dict["private"]["operations"]["operation-table"]["dropdown"]["modal"]["edit"];
  edited: Operation | null;
  setEdited: Dispatch<SetStateAction<Operation | null>>;
  type: OperationType;
  onEdit?: (updated: Operation) => void;
}

export default function EditModal({
  dict,
  type,
  edited,
  onEdit,
  setEdited,
  isOpen,
  onClose,
  onOpenChange,
}: Props) {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!onEdit) return;
    const formData = new FormData(e.target as HTMLFormElement);
    onEdit(formDataToOperation(formData, edited?.id) as Operation);
    onClose();
  };

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => setEdited(null)}
    >
      <ModalContent>
        <ModalHeader className="font-normal">
          <span>
            {dict.title} <span className="font-bold">{edited?.title}</span>
          </span>
        </ModalHeader>
        <Form
          id="edit-modal"
          buttonWrapperClassName="pb-6 px-6"
          mutation={onEdit ? undefined : updateOperation}
          onSubmit={onEdit ? onSubmit : undefined}
          onClose={onClose}
          successMessage={`Pomyślnie zmodyfikowano operację ${edited?.title}!`}
          callback={onClose}
        >
          <ModalBody className="relative flex items-center justify-center min-h-48 py-0 [&:has(+button)]:z-40 my-3">
            {edited && (
              <Manual
                dict={dict.form}
                withLabel={!onEdit}
                initialValue={edited}
                type={type}
              />
            )}
          </ModalBody>
        </Form>
      </ModalContent>
    </Modal>
  );
}
