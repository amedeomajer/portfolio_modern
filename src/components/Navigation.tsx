"use client";

import { useEffect, useState } from "react";
import {
  BG_FADE_MS,
  HERO_INTRO_COMPLETE_EVENT,
  INTRO_DARK_MS,
  NAME_FADE_MS,
  SUBTITLE_REVEAL_ESTIMATE_MS,
} from "@/constants/introTimeline";
import Dock from "./ui/Dock";
import MobileMenu from "./MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBriefcase,
  faFileAlt,
  faEnvelope,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const SECTION_IDS = ["hero", "about", "work", "experience", "contact"] as const;

const Navigation = () => {
  const [activeSection, setActiveSection] =
    useState<(typeof SECTION_IDS)[number]>("hero");
  const [showDock, setShowDock] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const sectionElements = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((element): element is HTMLElement => element !== null);

    if (sectionElements.length === 0) return;

    const visibilityBySection = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;

          if (entry.isIntersecting) {
            visibilityBySection.set(id, entry.intersectionRatio);
            return;
          }

          visibilityBySection.delete(id);
        });

        if (visibilityBySection.size === 0) return;

        const nextActiveSection = [...visibilityBySection.entries()].sort(
          (a, b) => b[1] - a[1],
        )[0]?.[0] as (typeof SECTION_IDS)[number] | undefined;

        if (nextActiveSection) {
          setActiveSection(nextActiveSection);
        }
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealDock = () => setShowDock(true);

    window.addEventListener(HERO_INTRO_COMPLETE_EVENT, revealDock);

    const fallbackDelayMs =
      INTRO_DARK_MS + NAME_FADE_MS + BG_FADE_MS + SUBTITLE_REVEAL_ESTIMATE_MS;
    const fallbackTimer = window.setTimeout(revealDock, fallbackDelayMs);

    return () => {
      window.removeEventListener(HERO_INTRO_COMPLETE_EVENT, revealDock);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const dockItems = [
    {
      icon: <FontAwesomeIcon icon={faHome} className="w-5 h-5" />,
      label: "Home",
      sectionId: "hero",
      isActive: activeSection === "hero",
      onClick: () => scrollToSection("hero"),
    },
    {
      icon: <FontAwesomeIcon icon={faUser} className="w-5 h-5" />,
      label: "About",
      sectionId: "about",
      isActive: activeSection === "about",
      onClick: () => scrollToSection("about"),
    },
    {
      icon: <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5" />,
      label: "Work",
      sectionId: "work",
      isActive: activeSection === "work",
      onClick: () => scrollToSection("work"),
    },
    {
      icon: <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />,
      label: "Experience",
      sectionId: "experience",
      isActive: activeSection === "experience",
      onClick: () => scrollToSection("experience"),
    },
    {
      icon: <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />,
      label: "Contact",
      sectionId: "contact",
      isActive: activeSection === "contact",
      onClick: () => scrollToSection("contact"),
    },
  ];

  return (
    <>
      <Dock items={dockItems} isVisible={showDock} />
      <MobileMenu />
    </>
  );
};

export default Navigation;
