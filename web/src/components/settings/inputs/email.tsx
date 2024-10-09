"use client";

import Form from "@/components/ui/form";
import { Input } from "@nextui-org/react";
import { useState } from "react";

export default function EmailInput({
  email: initialEmail,
}: Pick<Account, "email">) {
  const [email, setEmail] = useState(initialEmail || "");
  return (
    <Form buttonProps={{ size: "sm", radius: "md", children: "Zapisz" }}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 mb-2">
          <h3>Email</h3>
          <p className="text-sm text-font/60">
            Zmień email przypisany do twojego konta
          </p>
        </div>
        <Input
          classNames={{ inputWrapper: "!bg-light shadow-none border" }}
          name="email"
          label={"Email"}
          placeholder="example@mail.com"
          type="email"
          isRequired
          value={email}
          onValueChange={(value) => setEmail(value)}
        />
      </div>
    </Form>
  );
}
