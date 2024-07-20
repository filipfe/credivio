import { updateAccount } from "@/lib/settings/actions";
import { Button, Input } from "@nextui-org/react";
import { FormEvent } from "react";
import useSWR from "swr";

export default function PersonalDataInput() {
  const { data: account } = useSWR(["settings", "account"]);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        defaultValue={account?.first_name}
        className="max-w-xl"
      />
      <Input
        classNames={{ inputWrapper: "!bg-light" }}
        label={"Nazwisko"}
        name="last_name"
        placeholder="Nazwisko"
        defaultValue={account?.last_name}
        className="max-w-xl"
      />
      <Button
        size="sm"
        radius="md"
        color="primary"
        className="max-w-max self-end"
        type="submit"
      >
        Zapisz
      </Button>
    </form>
  );
}
