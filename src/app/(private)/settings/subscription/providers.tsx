"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

type Context = {
  activeService: Service | null;
  setActiveService: Dispatch<SetStateAction<Service | null>>;
};

export const ServiceContext = createContext<Context>(null!);

export default function ServiceProvider({
  children,
  defaultService,
}: {
  children: ReactNode[];
  defaultService?: Service;
}) {
  const [activeService, setActiveService] = useState<Service | null>(
    defaultService || null
  );
  return (
    <ServiceContext.Provider value={{ activeService, setActiveService }}>
      {children}
    </ServiceContext.Provider>
  );
}
