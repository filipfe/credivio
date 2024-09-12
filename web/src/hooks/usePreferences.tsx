import { getPreferences } from "@/lib/settings/queries";
import useSWR from "swr";

export default function usePreferences() {
  return useSWR("preferences", () => getPreferences());
}
