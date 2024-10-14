import Form from "@/components/ui/form";
import getDictionary from "@/const/dict";
import { requestPasswordChange } from "@/lib/auth/actions";
import { Input } from "@nextui-org/react";

export default async function Page({ params }: { params: { lang: Locale } }) {
  const {
    public: { auth },
  } = await getDictionary(params.lang);
  const dict = auth["forgot-password"];
  return (
    <div className="h-screen sm:h-auto min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white rounded-md px-6 sm:px-10 py-8 w-full max-w-[28rem] border">
        <Form
          mutation={requestPasswordChange}
          buttonWrapperClassName="max-w-none"
          buttonProps={{
            children: dict.form._submit.label,
            className: "w-full",
          }}
          successMessage={dict.form._toast.success}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2 mb-4">
              <div className="bg-light rounded-md h-16 w-16 mb-4 border grid place-content-center">
                <p className="font-bold text-primary text-3xl">C</p>
              </div>
              <h1 className="text-2xl font-medium">{dict.title}</h1>
              <p className="text-sm">{dict.description}</p>
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
          </div>
        </Form>
      </div>
    </div>
  );
}
