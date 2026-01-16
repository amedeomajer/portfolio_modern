import { useEffect, useState } from "react";

type ComponentType = "cv-picture" | "work" | "about";

type UseIsOnPhoneReturn = {
  isOnPhone: boolean;
  initialY: number | null;
  initialX: number | null;
  damping: number | null;
  screenWidth: number | null;
};

export const useIsOnPhone = (component: ComponentType): UseIsOnPhoneReturn => {
  const [isOnPhone, setIsOnPhone] = useState<boolean>(false);
  const [initialY, setInitialY] = useState<number | null>(null);
  const [initialX, setInitialX] = useState<number | null>(null);
  const [damping, setDamping] = useState<number | null>(null);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  useEffect(() => {
    const phoneCheck = window.innerWidth < 768;
    setIsOnPhone(phoneCheck);
    if (component === "cv-picture") {
      setInitialY(phoneCheck ? 100 : 1000);
      setDamping(phoneCheck ? 10 : 19);
      return;
    } else if (component === "work") {
      setInitialY(phoneCheck ? 0 : 1000);
      setInitialX(phoneCheck ? 400 : 0);
      return;
    } else if (component === "about") {
      setScreenWidth(window.innerWidth);
    }
  }, [component]);

  return { isOnPhone, initialY, initialX, damping, screenWidth };
};
