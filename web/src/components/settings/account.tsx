import { getAccount } from "@/lib/settings/queries";
import useSWR from "swr";
import PasswordInput from "./inputs/password";
import EmailInput from "./inputs/email";
import PersonalDataInput from "./inputs/personal-data";

export default function Account() {
  const { isLoading } = useSWR(["settings", "account"], getAccount);

  if (isLoading) {
    return (
      <div className="w-full h-full grid place-content-center">
        <l-hatch size={36} stroke={5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid grid-cols-3">
      <div className="lg:pr-8">
        <PersonalDataInput />
      </div>
      <div className="lg:border-x lg:px-8">
        <EmailInput />
      </div>
      <div className="lg:pl-8">
        <PasswordInput />
      </div>
    </div>
  );
}
