import Form from "@/components/auth/form";
import { Input } from "@nextui-org/react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-lg px-10 py-8 w-full max-w-lg border border-primary/10">
        <Form isSignUp>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border border-primary/10"></div>
              <h1 className="text-2xl font-medium">Witaj w Tipplet!</h1>
              <p className="text-sm">Zarejestruj się, aby kontynuować</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                classNames={{
                  inputWrapper:
                    "!bg-light shadow-none border border-primary/10",
                }}
                name="first-name"
                label="Imię"
                type="text"
                placeholder="Jan"
                isRequired
                required
                autoComplete="off"
              />
              <Input
                classNames={{
                  inputWrapper:
                    "!bg-light shadow-none border border-primary/10",
                }}
                name="last-name"
                label="Nazwisko"
                type="text"
                placeholder="Kowalski"
                autoComplete="off"
              />
            </div>
            <Input
              classNames={{
                inputWrapper: "!bg-light shadow-none border border-primary/10",
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
                inputWrapper: "!bg-light shadow-none border border-primary/10",
              }}
              name="password"
              label="Hasło"
              type="password"
              placeholder="**********"
              isRequired
              required
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
