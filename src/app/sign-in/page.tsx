import { signInWithEmail } from "../../lib/auth/actions";
import { Input } from "@nextui-org/input";

export default function Page() {
  return (
    <div className="h-full flex items-center justify-center">
      <form className="w-[20vw] flex flex-col gap-2">
        <Input name="email" type="email" label="Email" />
        <button
          formAction={signInWithEmail}
          className="py-3 px-6 rounded-lg text-sm font-medium flex items-center justify-center gap-4 hover:bg-light bg-white"
        >
          Send Magic Link
        </button>
      </form>
    </div>
  );
}
