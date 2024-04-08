"use client";

import { ServiceContext } from "@/app/(private)/settings/subscription/providers";
import Block from "@/components/ui/block";
import { LINKS } from "@/const";
import { activateService } from "@/lib/settings/actions";
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
import { Fragment, useContext, useTransition } from "react";
import toast from "react-hot-toast";

export default function ActiveService({
  ownedServices,
}: {
  ownedServices: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const { activeService } = useContext(ServiceContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  if (!activeService) return;
  const { id, title, href, description, price } = activeService;
  const link = LINKS.find((item) => item.href === href);
  const Icon = link ? link.icon : <></>;
  const currencyFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  const isActive = ownedServices.includes(id);

  return (
    <Block title="Wybrana usługa">
      <div className="flex flex-col items-center gap-4 flex-1">
        <Icon size={28} />
        <h3 className="text-2xl font-medium">{title}</h3>
        <p className="text-sm text-center max-w-[70%]">{description}</p>
        <div className="grid grid-cols-3 gap-4 my-4">
          <div className="border p-6 rounded-md bg-light"></div>
          <div className="border p-6 rounded-md bg-light"></div>
          <div className="border p-6 rounded-md bg-light"></div>
        </div>
        <strong className="text-4xl">
          {currencyFormatter.format(price)}{" "}
          <sub className="text-sm font-medium">/ miesiąc</sub>
        </strong>
        <div className="flex items-center gap-2 mt-auto">
          {!isActive && (
            <Button variant="light" color="primary">
              Wypróbuj
            </Button>
          )}
          <Button
            variant={isActive ? "flat" : "shadow"}
            color="primary"
            startContent={
              isActive ? <PauseIcon size={16} /> : <PlayIcon size={16} />
            }
            onClick={onOpen}
          >
            {isActive ? "Dezaktywuj" : "Aktywuj"}
          </Button>
        </div>
      </div>
      <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
        <ModalContent>
          {(onClose) => (
            <Fragment>
              <ModalHeader className="text-center flex justify-center pt-8">
                Czy na pewno chcesz aktywować {activeService.title}?
              </ModalHeader>
              <ModalBody className="text-center max-w-80 flex flex-col items-center w-full mx-auto my-4 text-sm">
                Do twojej subskrypcji zostanie naliczona następująca kwota:{" "}
                <strong className="font-semibold text-xl">
                  {currencyFormatter.format(activeService.price)}
                </strong>
              </ModalBody>
              <ModalFooter className="pb-6 px-8 grid grid-cols-2 gap-4 w-full mx-auto">
                <Button onClick={onClose} variant="flat" color="primary">
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
                    variant="shadow"
                    className="w-full"
                    isDisabled={isPending}
                    color="primary"
                    type="submit"
                    startContent={
                      isPending ? (
                        <Spinner color="white" size="sm" />
                      ) : isActive ? (
                        <PauseIcon size={16} />
                      ) : (
                        <PlayIcon size={16} />
                      )
                    }
                  >
                    {isActive ? "Dezaktywuj" : "Aktywuj"}
                  </Button>
                  <input
                    type="hidden"
                    name="service"
                    value={JSON.stringify({ id, href })}
                  />
                  <input
                    type="hidden"
                    name="is-active"
                    value={String(isActive)}
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
