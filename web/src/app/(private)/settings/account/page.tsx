import Block from "@/components/ui/block";
import { getAccount, updateAccount } from "@/lib/settings/actions";
import { Button, Input } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";

export default async function Page() {
  const { result: user } = await getAccount();

  return (
    <section className="sm:px-10 py-4 sm:py-8 grid grid-cols-3 gap-y-10 gap-x-6">
      <form action={updateAccount}>
        <Block
          title="Dane"
          cta={
            <Button
              type="submit"
              color="primary"
              className="!h-7 self-end"
              size="sm"
            >
              <CheckIcon size={16} />
              Zapisz
            </Button>
          }
        >
          <Input
            classNames={{ inputWrapper: "!bg-light" }}
            name="first_name"
            label={"Imię"}
            placeholder="Imię"
            defaultValue={user?.first_name}
          />
          <Input
            classNames={{ inputWrapper: "!bg-light" }}
            label={"Nazwisko"}
            name="last_name"
            placeholder="Nazwisko"
            defaultValue={user?.last_name}
          />
          <Input
            classNames={{ inputWrapper: "!bg-light" }}
            name="email"
            label={"Email"}
            placeholder="example@mail.com"
            type="email"
            isRequired
            defaultValue={user?.email}
            isDisabled
          />
        </Block>
      </form>
    </section>
  );
}
