import SettingsTabs from "@/components/settings/tabs";
import Block from "@/components/ui/block";
import getDictionary from "@/const/dict";
import { getPreferences } from "@/lib/settings/actions";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { result: preferences } = await getPreferences();
  if (!preferences) {
    throw new Error("Couldn't retrieve preferences");
  }
  const {
    private: { _navigation, settings },
  } = await getDictionary(preferences.language.code);
  return (
    <section className="sm:px-10 py-4 sm:py-8 flex flex-col flex-wrap gap-4 sm:gap-6 h-full">
      <Block
        title={settings.title}
        description={settings.description}
        className="flex-1"
      >
        <SettingsTabs dict={_navigation} />
        {children}
      </Block>
    </section>
  );
}
