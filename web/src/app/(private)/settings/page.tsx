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

// function LinkRef({ title, href, icon, description }: Page) {
//   const Icon = icon;
//   return (
//     <Link href={href} className="group">
//       <Block>
//         <Icon size={48} strokeWidth={1} className="hidden sm:block" />
//         <Icon size={36} className="sm:hidden" />
//         <h3 className="sm:text-lg font-medium relative max-w-max after:mt-1 after:max-w-[0%] group-hover:after:max-w-[60%] after:transition-[max-width] after:block after:w-full after:h-px after:bg-font">
//           {title}
//         </h3>
//         <p className="text-tiny sm:text-sm text-font/80">{description}</p>
//       </Block>
//     </Link>
//   );
// }
