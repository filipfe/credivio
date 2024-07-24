import SettingsTabs from "@/components/settings/tabs";
import Block from "@/components/ui/block";

export default function Settings() {
  return (
    <section className="sm:px-10 py-4 sm:py-8 flex flex-col flex-wrap gap-4 sm:gap-6 h-full">
      <Block
        title="Ustawienia"
        description="Zarządzaj swoimi danymi osobowymi, preferencjami i subskrypcją"
        className="flex-1 sm:max-h-[calc(var(--vh)*100-144px)]"
      >
        <SettingsTabs />
      </Block>
    </section>
  );
}
