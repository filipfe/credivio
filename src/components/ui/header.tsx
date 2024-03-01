import { Fragment } from "react";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@nextui-org/react";
import { AlignJustifyIcon } from "lucide-react";

export default function Header({
  isMenuHidden,
  setIsMenuHidden,
}: {
  isMenuHidden: boolean;
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Fragment>
      <header className="h-20 sticky top-0 bg-white flex items-center justify-between z-50 px-4">
        <div></div>
        <Button
          onPress={() => setIsMenuHidden((prev) => !prev)}
          className={`rounded-full h-10 w-10 min-w-0 px-0 ml-auto ${
            isMenuHidden ? "mr-auto" : ""
          }`}
          variant="light"
        >
          <AlignJustifyIcon size={20} />
        </Button>
      </header>
      <header className="flex items-center gap-4 justify-end px-10 h-20 sticky top-0 bg-white z-50">
        <form action={signOut}>
          <button className="py-3 px-6 rounded-lg text-sm font-medium flex items-center gap-4 hover:bg-light bg-white">
            Wyloguj
          </button>
        </form>
      </header>
    </Fragment>
  );
}
