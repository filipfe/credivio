import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import useSWR from "swr";

export default function EmailInput() {
  const { data: account } = useSWR(["settings", "account"]);
  const [email, setEmail] = useState(account?.email || "");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
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
      <Button
        isDisabled={email === account.email || !email}
        size="sm"
        radius="md"
        color="primary"
        disableRipple
        className="max-w-max self-end"
      >
        Zapisz
      </Button>
    </div>
  );
}
