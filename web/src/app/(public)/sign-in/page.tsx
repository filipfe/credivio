import Form from "@/components/auth/form";
import { Input } from "@nextui-org/react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-lg px-10 py-8 w-full max-w-[28rem] border border-primary/10">
        <Form>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border border-primary/10"></div>
              <h1 className="text-2xl font-medium">Witaj z powrotem!</h1>
              <p className="text-sm">Zaloguj się, aby kontynuować</p>
            </div>
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="email"
              label="Email"
              type="email"
              placeholder="example@mail.com"
              labelPlacement="outside"
              isRequired
              required
              autoComplete="off"
            />
            <Input
              classNames={{ inputWrapper: "!bg-light" }}
              name="password"
              label="Hasło"
              type="password"
              placeholder="**********"
              labelPlacement="outside"
              isRequired
              required
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
