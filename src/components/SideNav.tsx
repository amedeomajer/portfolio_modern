'use client';
import React from 'react';
import NavItem from './NavItem';
import { motion } from 'framer-motion';

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
      className="side-nav"
    >
      <ul>
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
