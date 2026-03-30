"use client";

import { ReactNode } from "react";
import { BackgroundProvider } from "@/context/BackgroundContext";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return <BackgroundProvider>{children}</BackgroundProvider>;
};

export default Providers;
