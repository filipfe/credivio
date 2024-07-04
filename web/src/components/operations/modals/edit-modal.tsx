"use client";

import {
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { SaveIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useTransition } from "react";
import Manual from "../inputs/manual";
import { updateOperation } from "@/lib/operations/actions";
import toast from "react-hot-toast";
import Toast from "@/components/ui/toast";

type Props = {
  edited: Operation | null;
  setEdited: Dispatch<SetStateAction<Operation | null>>;
  type: OperationType;
  onEdit?: (updated: Operation) => void;
};

export default function EditModal({ type, edited, setEdited }: Props) {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  useEffect(() => {
    edited && onOpen();
  }, [edited]);

  const onSubmitAction = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateOperation(formData);
      if (res?.error) {
        toast.custom((t) => <Toast {...t} type="error" message={res.error} />);
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
    });
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
            Edytuj wydatek <span className="font-bold">{edited?.title}</span>
          </span>
        </ModalHeader>
        <ModalBody className="relative flex items-center justify-center min-h-48 py-0 [&:has(+button)]:z-40 my-3">
          {edited && (
            <Manual
              withLabel
              initialValue={edited}
              type={type}
              action={onSubmitAction}
              id="edit-form"
            />
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
          <div className={isPending ? "opacity-60" : "opacity-100"}>
            <Button
              color="primary"
              disableRipple
              type="submit"
              disabled={isPending}
              isLoading={isPending}
              form="edit-form"
            >
              {!isPending && <SaveIcon size={16} />}
              Zapisz
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
