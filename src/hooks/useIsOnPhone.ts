import { useEffect, useState } from "react";

type UseIsOnPhoneRetrun = {
  isOnPhone: boolean;
  initialY: number | null;
  initialX: number | null;
  damping: number | null;
  screenWidth: number | null;
}

export const useIsOnPhone = (component: string) : UseIsOnPhoneRetrun => {
  const [isOnPhone, setIsOnPhone] = useState<boolean>(false);
  const [initialY, setInitialY] = useState<number | null>(null);
  const [initialX, setInitialX] = useState<number | null>(null);
  const [damping, setDamping] = useState<number | null>(null);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  useEffect(() => {
    const isOnPhone = window.innerWidth < 768;
    setIsOnPhone(isOnPhone);
    if (component === "cv-picture") {
      setInitialY(isOnPhone ? 100 : 1000);
      setDamping(isOnPhone ? 10 : 20);
      return;
    } else if (component === "work") {
      setInitialY(isOnPhone ? 0 : 1000);
      setInitialX(isOnPhone ? 400 : 0);
      return;
    } else if (component === "about") {
      setScreenWidth(window.innerWidth);
    }
  }, []);

  return { initialY, initialX, damping, screenWidth };
}