"use client";

import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import UniversalSelect from "@/components/ui/universal-select";
import { Select } from "@nextui-org/react";
import { useState } from "react";

export default function TimezoneSelect() {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const { options, parseTimezone } = useTimezoneSelect({});

  return (
    <UniversalSelect
      label="Strefa czasowa"
      selectedKeys={timezone ? [parseTimezone(timezone).value] : []}
      elements={options as Option<string>[]}
      onChange={(e) => setTimezone(e.target.value)}
    />
  );
}
