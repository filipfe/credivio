import Form from "@/components/auth/form";
import { Input } from "@nextui-org/react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen sm:h-auto min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-md px-6 sm:px-10 py-8 w-full max-w-[28rem] border">
        <Form>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border grid place-content-center">
                <p className="font-bold text-primary text-3xl">C</p>
              </div>
              <h1 className="text-2xl font-medium">Witaj z powrotem!</h1>
              <p className="text-sm">Zaloguj się, aby kontynuować</p>
            </div>
            <Input
              classNames={{
                inputWrapper: "!bg-light border shadow-none",
              }}
              name="email"
              label="Email"
              type="email"
              placeholder="example@mail.com"
              isRequired
              required
              autoComplete="off"
            />
            <Input
              classNames={{
                inputWrapper: "!bg-light border shadow-none",
              }}
              name="password"
              label="Hasło"
              type="password"
              placeholder="**********"
              isRequired
              required
            />
            <p className="text-sm">
              Nie pamiętasz hasła?{" "}
              <Link
                href="/forgot-password"
                className="text-primary font-medium hover:text-primary/60 transition-colors"
              >
                Zresetuj hasło
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
