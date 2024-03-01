import { Button } from "@nextui-org/react";
import { signInWithEmail } from "../../../lib/auth/actions";
import { Input } from "@nextui-org/input";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-lg px-10 py-8 w-full max-w-[28rem]">
        <form action={signInWithEmail} className="flex flex-col gap-6">
          <h1 className="text-3xl">Zaloguj się</h1>
          <Input
            classNames={{ inputWrapper: "!bg-light" }}
            name="email"
            label="Email"
            type="email"
            placeholder="example@mail.com"
            isRequired
          />
          <Button color="primary" type="submit" className="text-white">
            Zaloguj się
          </Button>
        </form>
      </div>
    </div>
  );
}
