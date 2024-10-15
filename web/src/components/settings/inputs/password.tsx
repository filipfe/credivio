"use client";

import Form from "@/components/ui/form";
import { Dict } from "@/const/dict";
import { resetPassword } from "@/lib/auth/actions";
import { Input } from "@nextui-org/react";
import { useState } from "react";

export default function PasswordInput({
  dict,
}: {
  dict: Dict["private"]["settings"]["account"]["password"];
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 mb-2">
        <h3>{dict.title}</h3>
        <p className="text-sm text-font/60">{dict.description}</p>
      </div>
      <Form
        mutation={resetPassword}
        buttonProps={{ size: "sm", radius: "md", children: "Zmień hasło" }}
        successMessage={dict.form._toast.success}
      >
        <div className="flex flex-col gap-4">
          <Input
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
            name="password"
            type="password"
            label={dict.form.password.label}
            placeholder="*********"
            value={password}
            onValueChange={(value) => setPassword(value)}
          />
          <Input
            classNames={{ inputWrapper: "!bg-light shadow-none border" }}
            name="password"
            type="password"
            label={dict.form["confirm-password"].label}
            placeholder="*********"
            value={confirmPassword}
            onValueChange={(value) => setConfirmPassword(value)}
          />
        </div>
      </Form>
    </div>
  );
}
