import { Dict } from "@/const/dict";
import LanguageSelect from "./language";
import TimezoneSelect from "./timezone";

export default function LocationInput({
  languageCode,
  dict,
}: {
  languageCode: Locale;
  dict: Dict["private"]["settings"]["preferences"]["location"];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 mb-2">
        <h3>{dict.title}</h3>
        <p className="text-sm text-font/60">{dict.description}</p>
      </div>
      <LanguageSelect dict={dict.language} defaultValue={languageCode} />
      <TimezoneSelect dict={dict.timezone} />
    </div>
  );
}
