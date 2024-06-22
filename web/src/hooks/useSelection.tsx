import { Selection, SelectionMode } from "@nextui-org/react";
import { useState } from "react";

export default function useSelection(items: string[]) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onSelectionChange = (keys: Selection) => {
    const isAll = keys === "all";
    if (isAll) {
      setSelectedKeys((prev) => [...prev, ...items]);
    } else {
      setSelectedKeys((prev) => [
        ...prev.filter((id) => !items.includes(id)),
        ...items.filter((id) => keys.has(id)),
      ]);
    }
  };

  const onRowAction = (key: string) => {
    if (selectedKeys.length > 0) return;
    setSelectedKeys([key.toString()]);
  };

  return {
    selectionMode: (selectedKeys.length === 0
      ? "none"
      : "multiple") as SelectionMode,
    selectedKeys: items.every((id) => selectedKeys.includes(id))
      ? "all"
      : new Set(selectedKeys),
    onSelectionChange,
    onRowAction,
  };
}
