import Toast from "@/components/ui/toast";
import { updateAccount } from "@/lib/settings/queries";
import { Button, Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function PersonalDataInput() {
  const {
    data: account,
    mutate,
    isValidating,
  } = useSWR(["settings", "account"]);
  const [firstName, setFirstName] = useState(account?.first_name || "");
  const [lastName, setLastName] = useState(account?.last_name || "");
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const updated = { first_name: firstName, last_name: lastName };
    const { error } = await updateAccount(updated);
    if (error) {
      toast.custom((t) => (
        <Toast {...t} type="error" message="Wystąpił błąd!" />
      ));
    } else {
      toast.custom((t) => (
        <Toast {...t} type="success" message="Pomyślnie zmieniono dane!" />
      ));
    }
    mutate({ ...account, ...updated });
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <h3>Dane osobowe</h3>
        <p className="text-sm text-font/60">
          Dostosuj dane osobowe do swojego konta
        </p>
      </div>
      <Input
        classNames={{ inputWrapper: "!bg-light" }}
        name="first_name"
        label={"Imię"}
        placeholder="Imię"
        value={firstName}
        onValueChange={(value) => setFirstName(value)}
        className="max-w-xl"
      />
      <Input
        classNames={{ inputWrapper: "!bg-light" }}
        label={"Nazwisko"}
        name="last_name"
        placeholder="Nazwisko"
        value={lastName}
        onValueChange={(value) => setLastName(value)}
        className="max-w-xl"
      />
      <Button
        size="sm"
        radius="md"
        color="primary"
        className="max-w-max self-end"
        type="submit"
        disableRipple
        isDisabled={
          (account?.first_name === firstName &&
            account?.last_name === lastName) ||
          isValidating
        }
      >
        Zapisz
      </Button>
    </form>
  );
}
