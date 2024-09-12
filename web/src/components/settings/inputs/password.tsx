import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

export default function PasswordInput() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3>Hasło</h3>
        <p className="text-sm text-font/60">Zmień hasło do swojego konta</p>
      </div>
      <Input
        classNames={{ inputWrapper: "!bg-light shadow-none border" }}
        name="password"
        type="password"
        label="Nowe hasło"
        placeholder="*********"
        value={password}
        onValueChange={(value) => setPassword(value)}
      />
      <Input
        classNames={{ inputWrapper: "!bg-light shadow-none border" }}
        name="password"
        type="password"
        label="Potwierdź nowe hasło"
        placeholder="*********"
        value={confirmPassword}
        onValueChange={(value) => setConfirmPassword(value)}
      />
      <Button
        isDisabled={!password || !confirmPassword}
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
