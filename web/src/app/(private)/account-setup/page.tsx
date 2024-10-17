import AccountSetupForm from "@/components/account-setup/form";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";

export default async function AccountSetup() {
  const settings = await getSettings();

  const { private: dict } = await getDictionary(settings.language);

  return (
    <div className="h-screen sm:h-auto min-h-screen sm:px-10 py-4 sm:py-8 flex items-center justify-center">
      <div className="mx-auto w-full max-w-xl flex flex-col gap-4 sm:gap-6">
        <AccountSetupForm settings={settings} dict={dict} />
      </div>
    </div>
  );
}
