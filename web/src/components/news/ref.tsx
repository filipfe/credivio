import Image from "next/image";
import Link from "next/link";

interface Props extends News {
  preferences: Preferences;
}

export default function NewsRef({
  title,
  thumbnail,
  original_url,
  summary,
  timestamp,
  preferences,
}: Props) {
  return (
    <article className="border bg-white rounded-md p-6 sm:p-4 flex flex-col gap-2">
      {thumbnail && thumbnail.length > 0 && (
        <figure className="h-56 rounded-md border bg-light relative overflow-hidden max-w-96 aspect-square">
          <Image
            width={384}
            height={192}
            className="w-full h-full object-contain"
            src={thumbnail[0].replace("http://", "https://")}
            alt=""
          />
        </figure>
      )}
      <Link
        className="hover:underline"
        href={original_url}
        target="_blank"
        rel="noreferrer"
      >
        <h4 className="line-clamp-3 font-medium mt-2 leading-snug">{title}</h4>
      </Link>
      <p className="line-clamp-3 text-font/60 text-sm">{summary}</p>
      <div className="flex-1 mt-2 flex items-end gap-2">
        <span className="text-font/80 text-sm">
          {new Intl.DateTimeFormat(preferences.language.code, {
            dateStyle: "short",
          }).format(new Date(timestamp * 1000))}
        </span>
      </div>
    </article>
  );
}
