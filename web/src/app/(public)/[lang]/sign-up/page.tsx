import Form from "@/components/auth/form";
import getDictionary from "@/const/dict";
import { Input } from "@nextui-org/react";

export default async function Page({ params }: { params: { lang: Locale } }) {
  const {
    public: {
      auth: { _layout, ...auth },
    },
  } = await getDictionary(params.lang);
  const signUp = auth["sign-up"];
  return (
    <div className="h-screen sm:h-auto min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-md px-6 sm:px-10 py-8 w-full max-w-lg border">
        <Form isSignUp dict={{ ..._layout, ...signUp }}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border"></div>
              <h1 className="text-2xl font-medium">{signUp.title}</h1>
              <p className="text-sm">{signUp.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                classNames={{
                  inputWrapper: "!bg-light shadow-none border",
                }}
                name="first-name"
                label={signUp.form["first-name"].label}
                type="text"
                placeholder="Jan"
                isRequired
                required
                autoComplete="off"
              />
              <Input
                classNames={{
                  inputWrapper: "!bg-light shadow-none border",
                }}
                name="last-name"
                label={signUp.form["last-name"].label}
                type="text"
                isRequired
                required
                placeholder="Kowalski"
                autoComplete="off"
              />
            </div>
            <Input
              classNames={{
                inputWrapper: "!bg-light shadow-none border",
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
                inputWrapper: "!bg-light shadow-none border",
              }}
              name="password"
              label={signUp.form.password.label}
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
