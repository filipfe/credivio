import NavLink from "./nav-link";
import { SettingsIcon } from "lucide-react";
import Nav from "./nav";

export default function Sidebar() {
  return (
    // <div className="fixed z-50 sm:sticky top-20 w-screen">
    <aside className="sm:sticky top-20 bg-white h-[calc(100vh-80px)] px-4 flex flex-col justify-between pb-4 relative z-50 max-w-max">
      <Nav />
      <NavLink title="Ustawienia" href="/settings" icon={SettingsIcon} />
    </aside>
    //   <div className="z-40 absolute inset-0 w-full h-full bg-font/40 sm:hidden"></div>
    // </div>
  );
}
