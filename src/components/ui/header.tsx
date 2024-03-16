import { Fragment } from "react";
import { signOut } from "@/lib/auth/actions";
import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import { AlignJustifyIcon, LogOutIcon } from "lucide-react";
import { LINKS } from "@/const";
import { usePathname } from "next/navigation";

type Props = {
  links?: Page[];
  isMenuHidden: boolean;
  setIsMenuHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ isMenuHidden, setIsMenuHidden }: Props) {
  const pathname = usePathname();
  const flatten = (arr: Page[]): Page[] =>
    arr.flatMap(({ links, ...page }) => [page, ...flatten(links || [])]);
  const links = flatten(LINKS).filter(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  );
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
        {/* {links.length === 1 ? (
          <div></div>
        ) : ( */}
        <Breadcrumbs
          itemClasses={{
            item: "px-2 flex items-center gap-2.5 text-[13px] data-[current=true]:font-medium",
          }}
        >
          {links.map((link) => (
            <BreadcrumbItem
              startContent={<link.icon size={14} />}
              key={link.href}
              href={link.href}
            >
              {link.title}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
        {/* )} */}
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
