"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, MotionValue } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useBackground, BackgroundType } from "@/context/BackgroundContext";

const backgroundOptions: { value: BackgroundType; label: string }[] = [
  { value: "waves", label: "Waves" },
  { value: "aurora", label: "Aurora" },
  { value: "liquidChrome", label: "Liquid Chrome" },
  { value: "lightRays", label: "Light Rays" },
  { value: "gradientBlinds", label: "Gradient Blinds" },
];

interface BackgroundSwitcherProps {
  isHovered?: MotionValue<number>;
}

const BackgroundSwitcher = ({
  isHovered: _isHovered,
}: BackgroundSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { background, setBackground } = useBackground();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: BackgroundType) => {
    setBackground(value);
    setIsOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Menu position: above on mobile (dock at bottom), below on desktop (dock at top)
  const menuPosition = isDesktop ? "top-full mt-3" : "bottom-full mb-3";

  return (
    <div
      ref={menuRef}
      className="relative flex items-center justify-center w-full h-full"
    >
      <button
        onClick={handleToggle}
        className="flex items-center justify-center w-full h-full rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-muted"
        aria-label="Change background"
        aria-expanded={isOpen}
      >
        <FontAwesomeIcon icon={faPalette} className="w-5 h-5 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: isDesktop ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isDesktop ? -10 : 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${menuPosition} z-50`}
          >
            <div className="bg-bg-black backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl min-w-[180px]">
              <div className="px-3 py-2 bg-white/5">
                <span className="text-xs text-text-muted uppercase tracking-wider">
                  Background
                </span>
              </div>
              <div className="">
                {backgroundOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-white/5 transition-colors ${
                      background === option.value
                        ? "text-white"
                        : "text-text-muted"
                    }`}
                  >
                    <span>{option.label}</span>
                    {background === option.value && (
                      <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackgroundSwitcher;
