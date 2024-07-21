"use client";

import Block from "@/components/ui/block";
import { LINKS } from "@/const";
import { activateService } from "@/lib/settings/actions";
import numberFormat from "@/utils/formatters/currency";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Fragment, useTransition } from "react";
import toast from "react-hot-toast";

type Props = {
  service?: Service;
};

export default function ActiveService({ service }: Props) {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  if (!service) return;
  const { id, title, href, description, price, is_active } = service;
  const link = LINKS.find((item) => item.href === href);
  const Icon = link ? link.icon : <></>;

  return (
    <Block className="order-first">
      <div className="flex flex-col items-center gap-4 flex-1 mt-4">
        <div className="h-20 w-20 bg-light border border-primary/10 rounded-md grid place-content-center mb-4">
          <Icon size={32} />
        </div>
        <h3 className="text-2xl font-medium">{title}</h3>
        <p className="text-sm text-center max-w-lg">{description}</p>
        <div className="grid grid-cols-3 gap-4 my-4">
          <div className="border p-6 rounded-md bg-light"></div>
          <div className="border p-6 rounded-md bg-light"></div>
          <div className="border p-6 rounded-md bg-light"></div>
        </div>
        <strong className="text-4xl mb-8">
          {numberFormat("PLN", price)}{" "}
          <sub className="text-sm font-medium">/ miesiąc</sub>
        </strong>
        <div className="flex items-center gap-2 mt-auto">
          {!is_active && (
            <Button variant="light" color="primary">
              Wypróbuj
            </Button>
          )}
          <Button
            variant={is_active ? "flat" : "shadow"}
            color="primary"
            startContent={
              is_active ? <PauseIcon size={16} /> : <PlayIcon size={16} />
            }
            onClick={onOpen}
          >
            {is_active ? "Dezaktywuj" : "Aktywuj"}
          </Button>
        </div>
      </div>
      <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
        <ModalContent>
          {(onClose) => (
            <Fragment>
              <ModalHeader className="text-center flex justify-center pt-8">
                Czy na pewno chcesz aktywować {title}?
              </ModalHeader>
              <ModalBody className="text-center max-w-64 flex flex-col items-center w-full mx-auto my-4 text-sm">
                Do twojej subskrypcji zostanie naliczona następująca kwota:{" "}
                <strong className="font-semibold text-xl">
                  {numberFormat("PLN", price)}
                </strong>
              </ModalBody>
              <ModalFooter className="pb-6 px-8 grid grid-cols-2 gap-3 w-full mx-auto">
                <Button disableRipple className="font-medium" onClick={onClose}>
                  Anuluj
                </Button>
                <form
                  action={(data) =>
                    startTransition(async () => {
                      const { error } = await activateService(data);
                      if (error) {
                        toast.error(error);
                      } else {
                        onClose();
                      }
                    })
                  }
                >
                  <Button
                    className="w-full font-medium"
                    isDisabled={isPending}
                    disableRipple
                    color="primary"
                    type="submit"
                    startContent={
                      isPending ? (
                        <Spinner color="white" size="sm" />
                      ) : is_active ? (
                        <PauseIcon size={16} />
                      ) : (
                        <PlayIcon size={16} />
                      )
                    }
                  >
                    {is_active ? "Dezaktywuj" : "Aktywuj"}
                  </Button>
                  <input
                    type="hidden"
                    name="service"
                    value={JSON.stringify({ id, href })}
                  />
                  <input
                    type="hidden"
                    name="is-active"
                    value={String(is_active)}
                  />
                </form>
              </ModalFooter>
            </Fragment>
          )}
        </ModalContent>
      </Modal>
    </Block>
  );
}
