import Form from "@/components/ui/form";
import { resetPassword } from "@/lib/auth/actions";
import { Input } from "@nextui-org/react";

export default function Page() {
  return (
    <div className="h-screen sm:h-auto min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-md px-6 sm:px-10 py-8 w-full max-w-[28rem] border">
        <Form
          isPasswordReset
          mutation={resetPassword}
          buttonWrapperClassName="max-w-none"
          buttonProps={{ children: "Zatwierdź", className: "w-full" }}
          successMessage="Hasło zostało pomyślnie zmienione!"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border grid place-content-center">
                <p className="font-bold text-primary text-3xl">C</p>
              </div>
              <h1 className="text-2xl font-medium">Zresetuj hasło</h1>
              <p className="text-sm">Wprowadź nowe hasło, aby kontynuować</p>
            </div>
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
            <Input
              classNames={{
                inputWrapper: "!bg-light border shadow-none",
              }}
              name="confirm-password"
              label="Potwierdź hasło"
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
