import { getNews } from "@/lib/news/actions";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams?: { page: string };
}) {
  const page = searchParams?.page;
  const { results } = await getNews(page ? parseInt(page) : 0);
  return (
    <div className="px-12 pt-8 pb-24">
      <h1 className="text-3xl">Aktualności</h1>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-y-10 gap-x-6 mt-12">
        {/* {[...first, ...second].map((item, i) => (
          <NewsRef {...item} key={i} />
        ))} */}
      </section>
    </div>
  );
}

const NewsRef = ({
  title,
  link,
  image_url,
  source_id,
  source_icon,
  source_url,
  pubDate,
}: News) => {
  const validImageUrl = image_url
    ? image_url.replace(/http:\/\//g, "https://")
    : "";
  return (
    <article>
      <Link href={link}>
        <div className="flex flex-col">
          <div className="h-48 w-full relative rounded overflow-hidden bg-white mb-4">
            {image_url && (
              <Image
                fill
                sizes="560px"
                className="w-full object-cover max-h-full"
                src={validImageUrl}
                alt={source_id}
              />
            )}
            {source_icon && (
              <Link
                href={source_url}
                className="absolute right-4 bottom-4 rounded bg-white shadow w-10 h-10 grid place-content-center"
              >
                <Image
                  width={24}
                  height={24}
                  className="rounded"
                  src={source_icon}
                  alt={source_id}
                />
              </Link>
            )}
          </div>
          <span className="text-sm mb-1">
            {new Date(pubDate).toLocaleDateString()}
          </span>
          <p className="font-medium">{title}</p>
        </div>
      </Link>
    </article>
  );
};
