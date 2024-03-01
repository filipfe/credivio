import { Fragment } from "react";
import { signOut } from "@/lib/auth/actions";

export default function Header() {
  return (
    <Fragment>
      <header className="h-20 sticky top-0 bg-white z-50"></header>
      <header className="flex items-center gap-4 justify-end px-10 h-20 sticky top-0 bg-white z-50">
        <button
          className="py-3 px-6 rounded-lg text-sm font-medium flex items-center gap-4 hover:bg-light bg-white"
          onClick={async () => {
            await signOut();
          }}
        >
          Log Out
        </button>
      </header>
    </Fragment>
  );
}
