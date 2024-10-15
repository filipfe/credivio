import EmailInput from "@/components/settings/inputs/email";
import PasswordInput from "@/components/settings/inputs/password";
import PersonalDataInput from "@/components/settings/inputs/personal-data";
import getDictionary from "@/const/dict";
import { getAccount } from "@/lib/settings/actions";

export default async function Page() {
  const { result: account, error } = await getAccount();

  if (error || !account) {
    throw new Error(error);
  }

  const {
    private: {
      settings: { account: dict },
    },
  } = await getDictionary(account.language);

  return (
    <div className="flex flex-col lg:grid grid-cols-3">
      <div className="lg:pr-8">
        <PersonalDataInput {...account} dict={dict["personal-data"]} />
      </div>
      <div className="lg:border-x lg:px-8">
        <EmailInput email={account.email} dict={dict.email} />
      </div>
      <div className="lg:pl-8">
        <PasswordInput dict={dict.password} />
      </div>
    </div>
  );
}
