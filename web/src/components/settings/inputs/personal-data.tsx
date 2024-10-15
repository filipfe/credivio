"use client";

import Form from "@/components/ui/form";
import Toast from "@/components/ui/toast";
import { updateAccount } from "@/lib/settings/queries";
import { Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function PersonalDataInput({
  first_name,
  last_name,
}: Pick<Account, "first_name" | "last_name">) {
  const [firstName, setFirstName] = useState(first_name);
  const [lastName, setLastName] = useState(last_name);

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
    // mutate({ ...account, ...updated });
  };

  return (
    <Form buttonProps={{ size: "sm", radius: "md", children: "Zapisz" }}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 mb-2">
          <h3>Dane osobowe</h3>
          <p className="text-sm text-font/60">
            Dostosuj dane osobowe do swojego konta
          </p>
        </div>
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="first_name"
          label={"Imię"}
          placeholder="Imię"
          value={firstName}
          onValueChange={(value) => setFirstName(value)}
          className="max-w-xl"
        />
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          label={"Nazwisko"}
          name="last_name"
          placeholder="Nazwisko"
          value={lastName}
          onValueChange={(value) => setLastName(value)}
          className="max-w-xl"
        />
      </div>
    </Form>
  );
}
