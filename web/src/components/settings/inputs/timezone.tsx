"use client";

import { useTimezoneSelect } from "react-timezone-select";
import UniversalSelect from "@/components/ui/universal-select";
import { useState } from "react";

export default function TimezoneSelect() {
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timezone, setTimezone] = useState(deviceTimezone);
  const { options, parseTimezone } = useTimezoneSelect({});

  return (
    <>
      <UniversalSelect
        label="Strefa czasowa"
        selectedKeys={timezone ? [parseTimezone(timezone).value] : []}
        elements={options as Option<string>[]}
        onChange={(e) =>
          setTimezone(
            parseTimezone(e.target.value).value ===
              parseTimezone(deviceTimezone).value
              ? deviceTimezone
              : e.target.value
          )
        }
      />
      <input type="hidden" name="timezone" value={timezone} />
    </>
  );
}
