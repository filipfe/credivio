import { Button } from "@nextui-org/react";
import CurrencySelect from "./currency";
import LanguageSelect from "./language";
import useSWR from "swr";

export default function LocationInput() {
  const { data: preferences } = useSWR(["settings", "preferences"]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3>Lokalizacja</h3>
        <p className="text-sm text-font/60">Wybierz język i domyślną walutę</p>
      </div>
      <CurrencySelect
        defaultValue={preferences ? preferences["currency"] : ""}
      />
      <LanguageSelect
        defaultValue={preferences ? preferences["language"].name : ""}
      />
      <Button
        size="sm"
        radius="md"
        color="primary"
        className="max-w-max self-end"
      >
        Zapisz
      </Button>
    </div>
  );
}
