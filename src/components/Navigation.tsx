"use client";

import Dock from "./ui/Dock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBriefcase,
  faFileAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const dockItems = [
    {
      icon: <FontAwesomeIcon icon={faUser} className="w-5 h-5" />,
      label: "About",
      onClick: () => scrollToSection("about"),
    },
    {
      icon: <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5" />,
      label: "Work",
      onClick: () => scrollToSection("work"),
    },
    {
      icon: <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />,
      label: "Experience",
      onClick: () => scrollToSection("experience"),
    },
    {
      icon: <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />,
      label: "Contact",
      onClick: () => scrollToSection("contact"),
    },
  ];

  return <Dock items={dockItems} />;
};

export default Navigation;
