"use client";

import Form from "@/components/ui/form";
import Toast from "@/components/ui/toast";
import { Dict } from "@/const/dict";
import { Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface Props extends Pick<Account, "first_name" | "last_name"> {
  dict: Dict["private"]["settings"]["account"]["personal-data"];
}

export default function PersonalDataInput({
  first_name,
  last_name,
  dict,
}: Props) {
  const [firstName, setFirstName] = useState(first_name);
  const [lastName, setLastName] = useState(last_name);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const updated = { first_name: firstName, last_name: lastName };
    // const { error } = await updateAccount(updated);
    // if (error) {
    //   toast.custom((t) => (
    //     <Toast {...t} type="error" message="Wystąpił błąd!" />
    //   ));
    // } else {
    //   toast.custom((t) => (
    //     <Toast {...t} type="success" message="Pomyślnie zmieniono dane!" />
    //   ));
    // }
  };

  return (
    <Form buttonProps={{ size: "sm", radius: "md", children: "Zapisz" }}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 mb-2">
          <h3>{dict.title}</h3>
          <p className="text-sm text-font/60">{dict.description}</p>
        </div>
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="first_name"
          label={dict.form["first-name"].label}
          placeholder={dict.form["first-name"].label}
          value={firstName}
          onValueChange={(value) => setFirstName(value)}
          className="max-w-xl"
        />
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          label={dict.form["last-name"].label}
          name="last_name"
          placeholder={dict.form["last-name"].label}
          value={lastName}
          onValueChange={(value) => setLastName(value)}
          className="max-w-xl"
        />
      </div>
    </Form>
  );
}
