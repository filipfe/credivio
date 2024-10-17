import SettingsTabs from "@/components/settings/tabs";
import Block from "@/components/ui/block";
import getDictionary from "@/const/dict";
import { getSettings } from "@/lib/general/actions";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  const {
    private: { _navigation, settings: _settings },
  } = await getDictionary(settings.language);

  return (
    <section className="sm:px-10 py-4 sm:py-8 flex flex-col flex-wrap gap-4 sm:gap-6 h-full">
      <Block
        title={_settings.title}
        description={_settings.description}
        className="flex-1"
      >
        <SettingsTabs dict={_navigation} />
        {children}
      </Block>
    </section>
  );
}
