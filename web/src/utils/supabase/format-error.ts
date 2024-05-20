import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
  PostgrestError,
} from "@supabase/supabase-js";

export default async function formatError(
  error: PostgrestError | null,
): Promise<string | null> {
  if (!error) return null;
  if (error instanceof FunctionsHttpError) {
    const json = await error.context.json();
    console.log("Function returned an error", json.error);
    return json.error;
  } else if (error instanceof FunctionsRelayError) {
    console.log("Relay error:", error.message);
    return error.message;
  } else if (error instanceof FunctionsFetchError) {
    console.log("Fetch error:", error.message);
    return error.message;
  }
  return "Wystąpił błąd, spróbuj ponownie później!";
}
