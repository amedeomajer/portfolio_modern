"use client";
import React from "react";
import { motion } from "framer-motion";

interface SmallNavItemProps {
  children: string;
  onClick: () => void;
  isActive: boolean;
}

const SmallNavItem: React.FC<SmallNavItemProps> = ({
  children,
  onClick,
  isActive,
}) => {
  return (
    <li
      className={`cursor-pointer ${isActive ? "text-red-500" : "text-white"}`}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

interface SmallNavProps {
  setSection: (section: number) => void;
  section: number;
}

const SmallNav: React.FC<SmallNavProps> = ({ setSection, section }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed bottom-0 md:hidden w-full py-3 z-50 backdrop-blur-md"
    >
      <ul className="font-black flex items-center justify-evenly">
        <SmallNavItem onClick={() => setSection(3)} isActive={section === 3}>
          about
        </SmallNavItem>
        <SmallNavItem onClick={() => setSection(2)} isActive={section === 2}>
          cv
        </SmallNavItem>
        <SmallNavItem onClick={() => setSection(1)} isActive={section === 1}>
          work
        </SmallNavItem>
      </ul>
    </motion.div>
  );
};

export default SmallNav;
