"use client";

import NavLink from "./nav-link";
import { BotIcon, SettingsIcon } from "lucide-react";
import Nav from "./nav";
import { useContext, useEffect, useRef } from "react";
import { MenuContext } from "@/app/(private)/providers";
import useOutsideObserver from "@/hooks/useOutsideObserver";
// import useSWR from "swr";
// import { createClient } from "@/utils/supabase/client";

// async function getTelegramToken() {
//   const supabase = createClient();
//   const { data } = await supabase
//     .from("profiles")
//     .select("telegram_id")
//     .single();
//   return data?.telegram_id;
// }

export default function Sidebar() {
  const aside = useRef<HTMLElement | null>(null);
  const { isMenuHidden, setIsMenuHidden } = useContext(MenuContext);
  // const { data, isLoading } = useSWR("telegram_id", () => getTelegramToken());

  useOutsideObserver(aside, () =>
    setIsMenuHidden((prev) => ({ ...prev, mobile: true }))
  );

  useEffect(() => {
    const onResize = () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div>
      <aside
        ref={aside}
        className={`fixed border-r sm:sticky top-16 bottom-0 left-0 sm:top-20 w-full bg-white sm:h-[calc(100vh-80px)] px-3 sm:px-4 flex flex-col gap-2 justify-between sm:pt-0 pt-4 pb-4 z-50 sm:transition-none transition-transform ${
          isMenuHidden.desktop
            ? "max-w-[14rem] sm:max-w-[6rem]"
            : "max-w-[14rem] sm:max-w-[15rem]"
        } ${
          isMenuHidden.mobile
            ? "-translate-x-[15rem] sm:translate-x-0"
            : "translate-x-0"
        }`}
      >
        <Nav />
        <div className="flex flex-col gap-2">
          <NavLink
            title="Automatyzacja"
            href="/automation"
            icon={BotIcon}
            // endContent={
            //   isLoading ? (
            //     <></>
            //   ) : (
            //     <div
            //       className={`${
            //         !!data?.telegram_id ? "bg-success/20" : "bg-danger/20"
            //       } h-3.5 w-3.5 rounded-full grid place-content-center`}
            //     >
            //       <div
            //         className={`${
            //           !!data?.telegram_id ? "bg-success" : "bg-danger"
            //         } h-2 w-2 rounded-full`}
            //       />
            //     </div>
            //   )
            // }
          />
          <NavLink title="Ustawienia" href="/settings" icon={SettingsIcon} />
        </div>
      </aside>
      <div
        className={`fixed bg-font/20 backdrop-blur-sm z-40 inset-0 w-screen h-screen sm:hidden ${
          isMenuHidden.mobile ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity`}
      ></div>
    </div>
  );
}
