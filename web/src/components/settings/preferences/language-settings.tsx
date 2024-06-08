"use client";

import UniversalSelect from "@/components/ui/universal-select";
import { LANGUAGES } from "@/const";
import { updatePreferences } from "@/lib/settings/actions";

export default function LanguageSettings({ language }: { language?: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold">Język</h2>
      <div className="flex text-nowrap items-center justify-between">
        Wybierz język
        <UniversalSelect
          className="w-32"
          size="sm"
          name="language"
          aria-label="Język"
          defaultSelectedKeys={language ? [language] : undefined}
          elements={LANGUAGES}
          onChange={(e) => updatePreferences("language", e.target.value)}
        />
      </div>
    </div>
  );
}
