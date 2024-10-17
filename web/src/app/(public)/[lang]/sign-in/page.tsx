import Form from "@/components/auth/form";
import getDictionary from "@/const/dict";
import { Input } from "@nextui-org/react";
import Link from "next/link";

export default async function Page({ params }: { params: { lang: Locale } }) {
  const {
    public: {
      auth: { _layout, ...auth },
    },
  } = await getDictionary(params.lang);
  const signIn = auth["sign-in"];
  return (
    <div className="h-screen sm:h-auto min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-md px-6 sm:px-10 py-8 w-full max-w-[28rem] border">
        <Form dict={{ ..._layout, ...auth["sign-in"] }}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border grid place-content-center">
                <p className="font-bold text-primary text-3xl">C</p>
              </div>
              <h1 className="text-2xl font-medium">{signIn.title}</h1>
              <p className="text-sm">{signIn.description}</p>
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
              label={signIn.form.password.label}
              type="password"
              placeholder="**********"
              isRequired
              required
            />
            <p className="text-sm">
              {signIn["forgot-password"].label}{" "}
              <Link
                href="/forgot-password"
                className="text-primary font-medium hover:text-primary/60 transition-colors"
              >
                {signIn["forgot-password"].link}
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
