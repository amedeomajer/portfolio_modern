"use client";
import React from "react";
import NavItem from "./NavItem";
import { motion } from "framer-motion";

interface SideNavProps {
  setSection: (section: number) => void;
  section: number;
}

const SideNav: React.FC<SideNavProps> = ({ setSection, section }) => {
  return (
    <motion.div
      initial={{ x: 350, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="hidden md:block pt-20"
    >
      <ul className="font-black  text-4xl xl:text-6xl flex flex-col gap-4 lg:gap-6 items-end">
        <NavItem onClick={() => setSection(3)} isActive={section == 3}>
          about
        </NavItem>
        <NavItem onClick={() => setSection(1)} isActive={section == 1}>
          work
        </NavItem>
        <NavItem onClick={() => setSection(2)} isActive={section == 2}>
          cv
        </NavItem>
      </ul>
    </motion.div>
  );
};

export default SideNav;
