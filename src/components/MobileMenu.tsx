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
} from "@fortawesome/free-solid-svg-icons";
import { useBackground, BackgroundType } from "@/context/BackgroundContext";
import GlassSurface from "./ui/GlassSurface";

const backgroundOptions: { value: BackgroundType; label: string }[] = [
  { value: "waves", label: "Waves" },
  { value: "aurora", label: "Aurora" },
  { value: "liquidChrome", label: "Liquid Chrome" },
  { value: "lightRays", label: "Light Rays" },
  { value: "gradientBlinds", label: "Gradient Blinds" },
];

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowBackgrounds(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div ref={menuRef} className="mobile-menu-wrapper">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-toggle"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <GlassSurface
          width={56}
          height={56}
          borderRadius={28}
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
            className="w-5 h-5 text-white"
          />
        </GlassSurface>
      </button>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mobile-menu-dropdown"
          >
            <div className="bg-bg-black/95 backdrop-blur-xl border border-glass-border rounded-2xl overflow-hidden shadow-2xl">
              {/* Navigation Items */}
              <div className="p-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="mobile-menu-item"
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-glass-border" />

              {/* Settings Section */}
              <div className="p-2">
                {/* Background Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setShowBackgrounds(!showBackgrounds)}
                    className="mobile-menu-item"
                  >
                    <FontAwesomeIcon icon={faPalette} className="w-4 h-4" />
                    <span>Background</span>
                    <span className="ml-auto text-xs text-text-muted">
                      {backgroundOptions.find((o) => o.value === background)?.label}
                    </span>
                  </button>

                  {/* Background Options */}
                  <AnimatePresence>
                    {showBackgrounds && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 pb-1">
                          {backgroundOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleBackgroundSelect(option.value)}
                              className={`mobile-menu-subitem ${
                                background === option.value
                                  ? "text-white"
                                  : "text-text-muted"
                              }`}
                            >
                              <span>{option.label}</span>
                              {background === option.value && (
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className="w-3 h-3 ml-auto"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Accessibility Toggle */}
                <button
                  onClick={() => {
                    toggleAccessibilityMode();
                  }}
                  className="mobile-menu-item"
                >
                  <FontAwesomeIcon
                    icon={faUniversalAccess}
                    className={`w-4 h-4 ${
                      accessibilityMode ? "text-green-400" : ""
                    }`}
                  />
                  <span>Accessibility</span>
                  <span
                    className={`ml-auto text-xs ${
                      accessibilityMode ? "text-green-400" : "text-text-muted"
                    }`}
                  >
                    {accessibilityMode ? "On" : "Off"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
