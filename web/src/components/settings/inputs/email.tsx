"use client";

import Form from "@/components/ui/form";
import { Dict } from "@/const/dict";
import { Input } from "@nextui-org/react";
import { useState } from "react";

interface Props extends Pick<Account, "email"> {
  dict: Dict["private"]["settings"]["account"]["email"];
}

export default function EmailInput({ email: initialEmail, dict }: Props) {
  const [email, setEmail] = useState(initialEmail || "");
  return (
    <Form buttonProps={{ size: "sm", radius: "md", children: "Zapisz" }}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 mb-2">
          <h3>{dict.title}</h3>
          <p className="text-sm text-font/60">{dict.description}</p>
        </div>
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="email"
          label={dict.form.email.label}
          placeholder={dict.form.email.placeholder}
          type="email"
          isRequired
          value={email}
          onValueChange={(value) => setEmail(value)}
        />
      </div>
    </Form>
  );
}
