import LocationInput from "@/components/settings/inputs/location";
import { getPreferences } from "@/lib/settings/actions";

export default async function Preferences() {
  const { result: preferences, error } = await getPreferences();

  if (error) {
    return <div className="flex-1"></div>;
  }

  if (!preferences) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col lg:grid grid-cols-3">
      <div className="lg:pr-8">
        <LocationInput {...preferences} />
      </div>
    </div>
  );
}
