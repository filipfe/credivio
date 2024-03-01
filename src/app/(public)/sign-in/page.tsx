import { signInWithEmail } from "../../../lib/auth/actions";
import { Input } from "@nextui-org/input";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        action={signInWithEmail}
        className="flex flex-col gap-2 w-full max-w-[20rem]"
      >
        <Input name="email" type="email" label="Email" variant="underlined" />
        <button className="py-3 px-6 rounded-lg text-sm font-medium flex items-center justify-center gap-4 hover:bg-light bg-white">
          Send Magic Link
        </button>
      </form>
    </div>
  );
}
