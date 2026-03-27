"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUser,
  faBriefcase,
  faFileAlt,
  faEnvelope,
  faHome,
  faPalette,
  faUniversalAccess,
  faCheck,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useBackground, BackgroundType } from "@/context/BackgroundContext";
import GlassSurface from "./ui/GlassSurface";
import { cn } from "@/lib/utils";

const backgroundOptions: { value: BackgroundType; label: string }[] = [
  { value: "waves", label: "Waves" },
  { value: "aurora", label: "Aurora" },
  { value: "liquidChrome", label: "Liquid Chrome" },
  { value: "lightRays", label: "Light Rays" },
  { value: "gradientBlinds", label: "Gradient Blinds" },
];

/* Match BackgroundSwitcher flyout (desktop dock) */
const menuPanelClass =
  "bg-bg-black backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl min-w-[220px]";
const menuRowClass =
  "w-full px-4 py-2.5 text-left text-sm flex items-center justify-between gap-3 hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    background,
    setBackground,
    accessibilityMode,
    toggleAccessibilityMode,
  } = useBackground();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleBackgroundSelect = (value: BackgroundType) => {
    setBackground(value);
    setShowBackgrounds(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setShowBackgrounds(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) setShowBackgrounds(false);
  }, [isOpen]);

  const currentBackgroundLabel =
    backgroundOptions.find((o) => o.value === background)?.label ?? "";

  const navItems = [
    { icon: faHome, label: "Home", action: () => scrollToSection("hero") },
    { icon: faUser, label: "About", action: () => scrollToSection("about") },
    { icon: faBriefcase, label: "Work", action: () => scrollToSection("work") },
    {
      icon: faFileAlt,
      label: "Experience",
      action: () => scrollToSection("experience"),
    },
    {
      icon: faEnvelope,
      label: "Contact",
      action: () => scrollToSection("contact"),
    },
  ];

  return (
    <div
      ref={menuRef}
      className="mobile-menu-root fixed inset-0 z-[1000] pointer-events-none hidden max-[569px]:block"
    >
      <div className="pointer-events-auto fixed bottom-4 left-1/2 z-[1002] w-max -translate-x-1/2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-toggle"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <GlassSurface
            width={40}
            height={40}
            borderRadius={20}
            borderWidth={0.07}
            brightness={50}
            opacity={0.93}
            blur={15}
            displace={0.5}
            distortionScale={-180}
            redOffset={0}
            greenOffset={20}
            blueOffset={30}
            backgroundOpacity={0.1}
            saturation={1}
            className="flex items-center justify-center"
          >
            <FontAwesomeIcon
              icon={isOpen ? faTimes : faBars}
              className="w-4 h-4 text-white"
            />
          </GlassSurface>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed inset-0 z-[1001] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
            role="presentation"
            onClick={closeMenu}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="max-h-[min(85dvh,calc(100dvh-8rem))] w-full max-w-[min(20rem,calc(100vw-2rem))] overflow-y-auto shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              onClick={(e) => e.stopPropagation()}
            >
            <div className={menuPanelClass}>
              <div>
                <div className="pb-1">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.action}
                      className={cn(menuRowClass, "text-white")}
                    >
                      <span className="flex items-center gap-3">
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="w-4 h-4 text-text-muted"
                        />
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-b border-white/[0.06]">
                <div className="pb-1">
                  <button
                    type="button"
                    onClick={() => setShowBackgrounds(!showBackgrounds)}
                    className={cn(menuRowClass, "text-white")}
                    aria-expanded={showBackgrounds}
                    aria-controls="mobile-menu-background-options"
                    id="mobile-menu-background-trigger"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <FontAwesomeIcon
                        icon={faPalette}
                        className="w-4 h-4 shrink-0 text-text-muted"
                      />
                      <span className="truncate">Background</span>
                    </span>
                    <span className="flex items-center gap-2 shrink-0 text-text-muted">
                      <span className="max-w-[7.5rem] truncate text-xs text-right">
                        {showBackgrounds ? "" : currentBackgroundLabel}
                      </span>
                      <FontAwesomeIcon
                        icon={showBackgrounds ? faChevronUp : faChevronDown}
                        className="w-3 h-3 opacity-80"
                        aria-hidden
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {showBackgrounds && (
                      <motion.div
                        id="mobile-menu-background-options"
                        role="region"
                        aria-labelledby="mobile-menu-background-trigger"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.2,
                          ease: [0.32, 0.72, 0, 1],
                        }}
                        className="overflow-hidden border-t border-white/[0.06]"
                      >
                        <div className="pb-1 pt-0.5">
                          {backgroundOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                handleBackgroundSelect(option.value)
                              }
                              className={cn(
                                menuRowClass,
                                background === option.value
                                  ? "text-white"
                                  : "text-text-muted",
                              )}
                            >
                              <span>{option.label}</span>
                              {background === option.value && (
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className="w-3 h-3 shrink-0"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border-t border-white/[0.06]">
                <div className="pb-1">
                  <button
                    type="button"
                    onClick={() => toggleAccessibilityMode()}
                    className={cn(menuRowClass, "text-white")}
                  >
                    <span className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faUniversalAccess}
                        className={cn(
                          "w-4 h-4 shrink-0",
                          accessibilityMode
                            ? "text-green-400"
                            : "text-text-muted",
                        )}
                      />
                      Accessibility
                    </span>
                    <span
                      className={cn(
                        "text-xs shrink-0",
                        accessibilityMode
                          ? "text-green-400"
                          : "text-text-muted",
                      )}
                    >
                      {accessibilityMode ? "On" : "Off"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
