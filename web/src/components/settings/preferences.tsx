import useSWR from "swr";
import { getPreferences } from "@/lib/settings/queries";
import LocationInput from "./inputs/location";

export default function Preferences() {
  const { isLoading } = useSWR(["settings", "preferences"], getPreferences);

  if (isLoading) {
    return (
      <div className="w-full h-full grid place-content-center">
        <l-hatch size={36} stroke={5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid grid-cols-3">
      <div className="lg:pr-8">
        <LocationInput />
      </div>
    </div>
  );
}
