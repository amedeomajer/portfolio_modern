'use client'
import React from 'react'
import { motion } from 'framer-motion'

const SmallNavItem = ({ children, onClick, isActive }) => {
  return (
    <p
      className={`cursor-pointer ${isActive ? 'text-red-500' : 'text-white'}`}
      onClick={onClick}
    >
      {children}
    </p>
  );
};


const SmallNav = ({ setSection, section, ...props }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      {...props}
      className="fixed bottom-0 md:hidden w-full py-3 z-50 backdrop-blur-md"
    >
      <ul className='font-black flex items-center justify-evenly'>
        <SmallNavItem onClick={() => setSection(1)} isActive={section === 1}>work</SmallNavItem>
        <SmallNavItem onClick={() => setSection(2)} isActive={section === 2}>cv</SmallNavItem>
        <SmallNavItem onClick={() => setSection(3)} isActive={section === 3}>about</SmallNavItem>
      </ul>
    </motion.div>
  );
};

export default SmallNav