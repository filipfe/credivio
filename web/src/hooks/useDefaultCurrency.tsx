import { getDefaultCurrency } from "@/lib/settings/queries";
import useSWR from "swr";

export default function useDefaultCurrency() {
  return useSWR("default_currency", getDefaultCurrency);
}
