"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type BackgroundType =
  | "waves"
  | "aurora"
  | "liquidChrome"
  | "lightRays"
  | "gradientBlinds";

interface BackgroundContextType {
  background: BackgroundType;
  setBackground: (bg: BackgroundType) => void;
  accessibilityMode: boolean;
  toggleAccessibilityMode: () => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const [background, setBackground] = useState<BackgroundType>("waves");
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const toggleAccessibilityMode = () => {
    setAccessibilityMode((prev) => !prev);
  };

  // Apply accessibility class to body when mode changes
  useEffect(() => {
    if (accessibilityMode) {
      document.body.classList.add("accessibility-mode");
    } else {
      document.body.classList.remove("accessibility-mode");
    }
  }, [accessibilityMode]);

  return (
    <BackgroundContext.Provider
      value={{ background, setBackground, accessibilityMode, toggleAccessibilityMode }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
};
