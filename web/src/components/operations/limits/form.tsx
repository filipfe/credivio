import Form from "@/components/ui/form";
import UniversalSelect from "@/components/ui/universal-select";
import { CURRENCIES } from "@/const";
import { useLimits } from "@/lib/general/queries";
import { addLimit } from "@/lib/operations/queries";
import formatAmount from "@/utils/operations/format-amount";
import toast from "@/utils/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { SaveIcon } from "lucide-react";
import { FormEvent, useLayoutEffect, useState } from "react";

const periods = [
  {
    value: "daily",
    label: "Dzienny",
  },
  {
    value: "weekly",
    label: "Tygodniowy",
  },
  {
    value: "monthly",
    label: "Miesięczny",
  },
];

interface Props
  extends Pick<
    ReturnType<typeof useDisclosure>,
    "onOpenChange" | "isOpen" | "onClose"
  > {
  defaultLimit: NewLimit;
}

export default function LimitForm({
  isOpen,
  onOpenChange,
  defaultLimit,
  onClose,
}: Props) {
  const [singleRecord, setSingleRecord] = useState<NewLimit>(defaultLimit);
  const { mutate } = useLimits(singleRecord.currency);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    setSingleRecord(defaultLimit);
  }, [defaultLimit]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await addLimit(singleRecord);
    if (error) {
      toast({
        type: "error",
        message: "Wystąpił błąd przy dodawaniu limitu",
      });
    } else {
      mutate();
      onClose();
    }
    setIsLoading(false);
  };

  const isEdit = !!defaultLimit.amount;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="font-normal">
              {isEdit ? "Edytuj" : "Nowy"} limit
            </ModalHeader>
            <Form
              onSubmit={onSubmit}
              buttonWrapperClassName="pb-4 px-6 mt-4"
              onClose={onClose}
              isLoading={isLoading}
            >
              <ModalBody>
                <div className="grid grid-cols-[1fr_128px] gap-4">
                  <Select
                    placeholder="Wybierz okres"
                    label="Okres"
                    required
                    name="period"
                    isDisabled={isEdit}
                    selectedKeys={
                      singleRecord.period ? [singleRecord.period] : []
                    }
                    isRequired
                    className="col-span-2"
                    classNames={{
                      trigger: "bg-light shadow-none border",
                    }}
                    onChange={(e) =>
                      setSingleRecord((prev) => ({
                        ...prev,
                        period: e.target.value as any,
                      }))
                    }
                  >
                    {periods.map((period) => (
                      <SelectItem key={period.value}>{period.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    classNames={{ inputWrapper: "bg-light shadow-none border" }}
                    name="amount"
                    label="Kwota"
                    placeholder="0.00"
                    isRequired
                    required
                    value={singleRecord.amount}
                    onBlur={(_) => {
                      const value = parseFloat(singleRecord.amount);
                      !isNaN(value) &&
                        setSingleRecord((prev) => ({
                          ...prev,
                          amount: value === 0 ? "" : value.toString(),
                        }));
                    }}
                    onChange={(e) => {
                      setSingleRecord((prev) => ({
                        ...prev,
                        amount: formatAmount(e.target.value),
                      }));
                    }}
                  />
                  <UniversalSelect
                    name="currency"
                    label="Waluta"
                    required
                    isRequired
                    isDisabled={isEdit}
                    selectedKeys={
                      singleRecord.currency ? [singleRecord.currency] : []
                    }
                    elements={CURRENCIES}
                    placeholder="Wybierz walutę"
                    disallowEmptySelection
                    onChange={(e) =>
                      setSingleRecord((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
                  />
                </div>
              </ModalBody>
            </Form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
