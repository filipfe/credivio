"use client";

import { useEffect, useState } from "react";

export default function ScrollCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      style={{
        willChange: "transform",
        transform: `translateX(${offset / 4}px)`,
      }}
      className="flex items-center min-w-max gap-2"
    >
      {children}
    </div>
  );
}
