import { Fragment } from "react";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@nextui-org/react";
import { AlignJustifyIcon, LogOutIcon } from "lucide-react";
import NavLink from "./nav-link";

type Props = {
  links?: Page[];
  isMenuHidden: boolean;
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({
  links,
  isMenuHidden,
  setIsMenuHidden,
}: Props) {
  return (
    <Fragment>
      <header className="h-20 sticky top-0 bg-white flex items-center justify-between z-50 px-4">
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
      <header className="flex items-center gap-4 justify-between px-10 h-20 sticky top-0 bg-white z-50">
        <nav className="flex items-center gap-1.5">
          {links &&
            links.map((item) => (
              <NavLink {...item} matchPath key={item.href} />
            ))}
        </nav>
        <form action={signOut}>
          <button className="py-3 px-6 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-light bg-white">
            <LogOutIcon size={16} />
            Wyloguj
          </button>
        </form>
      </header>
    </Fragment>
  );
}
