import EmailInput from "@/components/settings/inputs/email";
import PasswordInput from "@/components/settings/inputs/password";
import PersonalDataInput from "@/components/settings/inputs/personal-data";
import { getAccount } from "@/lib/settings/actions";

export default async function Page() {
  const { result: account, error } = await getAccount();

  if (error) {
    return <div className="flex-1"></div>;
  }

  if (!account) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col lg:grid grid-cols-3">
      <div className="lg:pr-8">
        <PersonalDataInput {...account} />
      </div>
      <div className="lg:border-x lg:px-8">
        <EmailInput email={account.email} />
      </div>
      <div className="lg:pl-8">
        <PasswordInput />
      </div>
    </div>
  );
}
