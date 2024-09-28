import NewsRef from "@/components/news/ref";
import { getNews } from "@/lib/news/actions";
import { getPreferences } from "@/lib/settings/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const { result: preferences, error } = await getPreferences();

  if (!preferences) {
    console.error(error);
    throw new Error("Couldn't retrieve preferences");
  }

  const { articles } = await getNews(
    preferences.language.code,
    searchParams.page ? parseInt(searchParams.page) : 1
  );

  return (
    <section className="sm:px-10 py-4 sm:py-8 flex flex-col md:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {[...articles]
        .sort(
          ({ timestamp: aTimestamp }, { timestamp: bTimestamp }) =>
            bTimestamp - aTimestamp
        )
        .map((item) => (
          <NewsRef {...item} preferences={preferences} key={item.news_id} />
        ))}
    </section>
  );
}
