import { WebVitals } from "@/components/web-vitals";
import Providers from "./providers";
import MobileActions from "@/components/ui/cta/mobile-actions";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import getDictionary from "@/const/dict";
import { getPreferences } from "@/lib/settings/actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { result: preferences } = await getPreferences();

  if (!preferences) {
    throw new Error("Couldn't retrieve preferences");
  }

  const {
    private: { _navigation },
  } = await getDictionary(preferences.language.code);

  return (
    <Providers>
      <Header dict={_navigation} />
      <Sidebar dict={_navigation} />
      <WebVitals />
      <main className="bg-light">{children}</main>
      <MobileActions />
    </Providers>
  );
}
