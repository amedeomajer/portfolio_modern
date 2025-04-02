'use client';
import React from 'react';
import { motion } from 'framer-motion';

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
    <li data-active={isActive} onClick={onClick}>
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
      className="small-nav backdrop-blur-md"
    >
      <ul>
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
